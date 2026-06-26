import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toCanvas as htmlToCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
import logo from "@/assets/laxmi-chemicals-logo.png";
import watermarkLogo from "@/assets/laxmi-chemicals-logo1.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { MsdsSheet } from "@/components/msds/MsdsSheet";
import { msdsData, msdsProductNames } from "@/data/msdsData";
import { COMPANY } from "@/data/company";

/** Load the logo as a faded (low-opacity) PNG data URL for the page watermark. */
const loadFadedLogo = (alpha: number) =>
  new Promise<{ url: string; w: number; h: number }>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, 0, 0);
      resolve({ url: c.toDataURL("image/png"), w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = watermarkLogo;
  });

const PASS = "laxmichem72";
const ISSUE_DATE = "01-04-2025";
const REVISION_DATE = "01-04-2026";

export default function Msds() {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const [selected, setSelected] = useState(msdsProductNames[0]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const data = msdsData[selected];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASS) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleDownloadPdf = async () => {
    const sheet = previewRef.current?.querySelector(".msds-sheet") as HTMLElement | null;
    if (!sheet) return;
    setDownloading(true);

    const safe = data.productName.replace(/[^\w-]+/g, "_");
    const filename = `${safe}_MSDS.pdf`;
    const footerLeft = `MSDS · ${data.productName.toUpperCase()} — ${COMPANY.name}`;

    try {
      // Wait for images (logos) to load.
      const imgs = Array.from(sheet.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((res) => {
                img.addEventListener("load", () => res(), { once: true });
                img.addEventListener("error", () => res(), { once: true });
              })
        )
      );

      const scale = 2;
      const sheetRect = sheet.getBoundingClientRect();

      // Render through the BROWSER's own engine (SVG foreignObject) so boxed,
      // centred text (the section chips and SDS badge) matches the on-screen
      // view exactly. The in-sheet watermark logos are excluded — the watermark
      // is drawn once per PDF page below instead.
      const fullCanvas = await htmlToCanvas(sheet, {
        pixelRatio: scale,
        backgroundColor: "#ffffff",
        cacheBust: true,
        width: sheet.offsetWidth,
        height: sheet.offsetHeight,
        style: { boxSizing: "border-box", margin: "0" },
        filter: (node: HTMLElement) =>
          !(node.classList && node.classList.contains("msds-watermark-logo")),
      });

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const M = 8; // top / left / right margin (mm)
      const footerSpace = 10; // bottom reserve (mm)
      const contentWmm = pageW - M * 2;
      const contentHmm = pageH - M - footerSpace;
      const pxPerMm = fullCanvas.width / contentWmm; // canvas px per mm
      const sliceHpx = Math.floor(contentHmm * pxPerMm);

      // Atomic blocks that must not be split across a page break.
      const atomics = Array.from(
        sheet.querySelectorAll(".msds-head, .msds-title, .msds-sec__head, .msds-row, table.msds-tbl, .msds-disclaimer")
      )
        .map((el) => {
          const r = (el as HTMLElement).getBoundingClientRect();
          return { top: (r.top - sheetRect.top) * scale, bottom: (r.bottom - sheetRect.top) * scale };
        })
        .sort((a, b) => a.top - b.top);

      const totalH = fullCanvas.height;
      const slices: { start: number; end: number }[] = [];
      let start = 0;
      while (start < totalH - 1) {
        let end = Math.min(start + sliceHpx, totalH);
        if (end < totalH) {
          // If a block straddles the cut, move the cut up to just before it.
          const straddler = atomics.find((a) => a.top < end - 1 && a.bottom > end + 1);
          if (straddler && straddler.top > start + 1) end = Math.floor(straddler.top);
        }
        if (end <= start) end = Math.min(start + sliceHpx, totalH);
        slices.push({ start, end });
        start = end;
      }

      const wm = await loadFadedLogo(0.06).catch(() => null);
      const wmW = 72;
      const wmH = wm ? wmW * (wm.h / wm.w) : 0;

      slices.forEach((s, idx) => {
        if (idx > 0) pdf.addPage();
        const sliceH = s.end - s.start;
        const tmp = document.createElement("canvas");
        tmp.width = fullCanvas.width;
        tmp.height = sliceH;
        const ctx = tmp.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, tmp.width, sliceH);
        ctx.drawImage(fullCanvas, 0, s.start, fullCanvas.width, sliceH, 0, 0, fullCanvas.width, sliceH);
        const imgData = tmp.toDataURL("image/jpeg", 0.95);
        const hMm = sliceH / pxPerMm;
        pdf.addImage(imgData, "JPEG", M, M, contentWmm, hMm);

        // One faint centred logo watermark per page.
        if (wm) pdf.addImage(wm.url, "PNG", (pageW - wmW) / 2, (pageH - wmH) / 2, wmW, wmH);

        // Footer with page numbers.
        pdf.setFontSize(8);
        pdf.setTextColor(120);
        pdf.text(footerLeft, M, pageH - 5);
        pdf.text(
          `Page ${idx + 1} of ${slices.length}  ·  ${data.docRef}  ·  Rev ${REVISION_DATE}`,
          pageW - M,
          pageH - 5,
          { align: "right" }
        );
      });

      pdf.save(filename);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate the MSDS PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f8ff] px-4 dark:bg-slate-950">
        <div className="w-full max-w-sm rounded-[28px] border border-slate-200 bg-white p-8 shadow-[var(--shadow-card)] dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex flex-col items-center gap-3">
            <img src={logo} alt="Laxmi Chemicals" className="h-14 w-20 object-contain" />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Restricted Access</h1>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Enter the password to access the MSDS generator.
            </p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError(false);
              }}
              autoFocus
            />
            {authError && (
              <p className="text-xs font-medium text-destructive">Incorrect password. Please try again.</p>
            )}
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
          <Button variant="ghost" className="mt-3 w-full" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-3 py-14 text-slate-900 sm:px-4 sm:py-24 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-5xl space-y-6 sm:space-y-8">
        {/* ── Header / actions ── */}
        <section className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-xl sm:rounded-[32px] sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:px-4 sm:py-2 sm:tracking-[0.3em]">
                Safety Documentation
              </span>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                Material Safety Data Sheet
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Pick a product to generate its 16-section MSDS on Laxmi Chemicals letterhead, then download it as
                a print-ready PDF.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm dark:bg-slate-800"
                aria-label="Select product"
              >
                {msdsProductNames.map((name) => (
                  <option key={name} value={name}>
                    {msdsData[name].productName}
                  </option>
                ))}
              </select>
              <Button size="sm" onClick={handleDownloadPdf} disabled={downloading} className="text-xs sm:text-sm">
                {downloading ? "Generating…" : "⬇ Download PDF"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} className="text-xs sm:text-sm">
                Print
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-xs sm:text-sm">
                Home
              </Button>
            </div>
          </div>
        </section>

        {/* ── Preview ── */}
        <section className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <div ref={previewRef} id="msds-pdf-root">
              <MsdsSheet data={data} issueDate={ISSUE_DATE} revisionDate={REVISION_DATE} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
