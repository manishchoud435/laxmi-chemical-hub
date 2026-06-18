import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Header as DocxHeader,
  Footer as DocxFooter,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  AlignmentType,
  WidthType,
  VerticalAlign,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  HorizontalPositionRelativeFrom,
  VerticalPositionRelativeFrom,
  convertMillimetersToTwip,
} from "docx";
import logo from "@/assets/laxmi-chemicals-logo.png";
import { COMPANY } from "@/data/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { LetterheadPreview } from "@/components/letterpad/LetterheadPreview";

const PASS = "laxmichem72";
const SINCE = "2006";
const FILE_BASE = "Laxmi_Chemicals_Letterhead";

// Fetch an asset URL and return it as a base64 data URI so it can be embedded
// inline in the Word document (Word can't resolve relative/blob URLs).
const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface IconPngs {
  address: string;
  gst: string;
  phone: string;
  email: string;
}

// Rasterize an on-page <svg> (e.g. a lucide icon) to a PNG data URI so it can
// be embedded in the Word document — Word's HTML import renders <img> reliably
// but not inline <svg>.
const svgElementToPng = (svgEl: SVGElement, size: number): Promise<string> =>
  new Promise((resolve) => {
    try {
      const clone = svgEl.cloneNode(true) as SVGElement;
      clone.setAttribute("width", String(size));
      clone.setAttribute("height", String(size));
      let markup = new XMLSerializer().serializeToString(clone);
      // resolve the CSS-driven stroke colour to a fixed value for standalone rendering
      markup = markup.replace(/currentColor/g, "#475569");
      if (!markup.includes("xmlns")) {
        markup = markup.replace("<svg", "<svg xmlns='http://www.w3.org/2000/svg'");
      }
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve("");
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve("");
      img.src = url;
    } catch {
      resolve("");
    }
  });

// The letterhead header renders exactly four lucide icons, in this DOM order.
const ICON_KEYS = ["address", "gst", "phone", "email"] as const;

const extractHeaderIconPngs = async (root: HTMLElement | null): Promise<IconPngs> => {
  const result: IconPngs = { address: "", gst: "", phone: "", email: "" };
  if (!root) return result;
  const svgs = Array.from(root.querySelectorAll("svg")).slice(0, ICON_KEYS.length) as SVGElement[];
  const pngs = await Promise.all(svgs.map((svg) => svgElementToPng(svg, 48)));
  ICON_KEYS.forEach((key, i) => {
    result[key] = pngs[i] ?? "";
  });
  return result;
};

// ── docx image helpers ──────────────────────────────────────────
const dataUrlToUint8Array = (dataUrl: string): Uint8Array => {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const getImageSize = (src: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
    img.onerror = () => resolve({ width: 1, height: 1 });
    img.src = src;
  });

// Re-draw an image at reduced opacity to use as a faint background watermark.
const makeFadedPng = (src: string, opacity: number): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 600;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("");
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve("");
    img.src = src;
  });

// Build a real, editable Word .docx letterhead. The company header and contact
// footer live in the page header/footer regions so they repeat on every page,
// the body is left blank to type into, and a faint logo sits behind the text.
const buildLetterheadDocx = async (logoDataUrl: string, icons: IconPngs, body: string): Promise<Blob> => {
  const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } as const;
  const noBorders = {
    top: NONE,
    bottom: NONE,
    left: NONE,
    right: NONE,
    insideHorizontal: NONE,
    insideVertical: NONE,
  };

  let logoPara: Paragraph | null = null;
  let watermarkPara: Paragraph | null = null;

  if (logoDataUrl) {
    const { width, height } = await getImageSize(logoDataUrl);
    const ratio = height / width || 1;
    const logoWidth = 132;
    const logoHeight = Math.max(1, Math.round(logoWidth * ratio));
    logoPara = new Paragraph({
      spacing: { after: 40 },
      children: [
        new ImageRun({
          type: "png",
          data: dataUrlToUint8Array(logoDataUrl),
          transformation: { width: logoWidth, height: logoHeight },
        }),
      ],
    });

    const faded = await makeFadedPng(logoDataUrl, 0.06);
    if (faded) {
      const wmWidth = 400;
      const wmHeight = Math.max(1, Math.round(wmWidth * ratio));
      watermarkPara = new Paragraph({
        children: [
          new ImageRun({
            type: "png",
            data: dataUrlToUint8Array(faded),
            transformation: { width: wmWidth, height: wmHeight },
            floating: {
              horizontalPosition: {
                relative: HorizontalPositionRelativeFrom.PAGE,
                align: HorizontalPositionAlign.CENTER,
              },
              verticalPosition: {
                relative: VerticalPositionRelativeFrom.PAGE,
                align: VerticalPositionAlign.CENTER,
              },
              behindDocument: true,
              allowOverlap: true,
            },
          }),
        ],
      });
    }
  }

  const iconRun = (dataUrl: string) =>
    dataUrl
      ? new ImageRun({
          type: "png",
          data: dataUrlToUint8Array(dataUrl),
          transformation: { width: 11, height: 11 },
        })
      : new TextRun("");

  const rightLine = (children: (TextRun | ImageRun)[]) =>
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 20 }, children });

  // Keep city + pincode together on the address line (matches the preview).
  const addrParts = COMPANY.address.split(",").map((s) => s.trim()).filter(Boolean);
  const addrLine1 = addrParts.length > 1 ? addrParts.slice(0, -1).join(", ") : COMPANY.address;
  const addrLine2 = addrParts.length > 1 ? addrParts[addrParts.length - 1] : "";
  const addressRuns: TextRun[] = [
    new TextRun({ text: "  " + addrLine1, size: 16, color: "64748B" }),
    ...(addrLine2 ? [new TextRun({ text: addrLine2, size: 16, color: "64748B", break: 1 })] : []),
  ];

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: noBorders,
            children: [
              ...(logoPara ? [logoPara] : []),
              new Paragraph({
                children: [new TextRun({ text: COMPANY.name, bold: true, size: 36, color: "0F172A" })],
              }),
              new Paragraph({
                spacing: { before: 20 },
                children: [new TextRun({ text: COMPANY.tagline, bold: true, size: 19, color: "2563EB" })],
              }),
              new Paragraph({
                spacing: { before: 20 },
                children: [new TextRun({ text: `SINCE ${SINCE}`, size: 13, color: "94A3B8" })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: noBorders,
            children: [
              rightLine([iconRun(icons.address), ...addressRuns]),
              rightLine([
                iconRun(icons.gst),
                new TextRun({ text: "  GSTIN: ", bold: true, size: 16, color: "475569" }),
                new TextRun({ text: COMPANY.gst, size: 16, color: "64748B" }),
              ]),
              rightLine([
                iconRun(icons.phone),
                new TextRun({ text: "  Ph: ", bold: true, size: 16, color: "475569" }),
                new TextRun({ text: COMPANY.phone, size: 16, color: "64748B" }),
              ]),
              rightLine([
                iconRun(icons.email),
                new TextRun({ text: "  Email: ", bold: true, size: 16, color: "475569" }),
                new TextRun({ text: COMPANY.email, size: 16, color: "64748B" }),
              ]),
            ],
          }),
        ],
      }),
    ],
  });

  const accentRule = new Paragraph({
    spacing: { before: 80, after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: "2563EB", space: 1 } },
    children: [new TextRun("")],
  });

  const docHeader = new DocxHeader({
    children: [...(watermarkPara ? [watermarkPara] : []), headerTable, accentRule],
  });

  const docFooter = new DocxFooter({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: "E2E8F0", space: 4 } },
        children: [
          new TextRun({
            text: `${COMPANY.address}   •   Ph: ${COMPANY.phone}   •   ${COMPANY.email}   •   GSTIN: ${COMPANY.gst}`,
            size: 15,
            color: "94A3B8",
          }),
        ],
      }),
    ],
  });

  const bodyParagraphs = body.trim()
    ? body.split("\n").map(
        (line) =>
          new Paragraph({
            spacing: { after: 120, line: 300 },
            children: [new TextRun({ text: line, size: 22, color: "0F172A" })],
          })
      )
    : [new Paragraph({ text: "" })];

  const doc = new DocxDocument({
    sections: [
      {
        properties: {
          page: {
            size: { width: convertMillimetersToTwip(210), height: convertMillimetersToTwip(297) },
            margin: {
              top: convertMillimetersToTwip(40),
              right: convertMillimetersToTwip(19),
              bottom: convertMillimetersToTwip(26),
              left: convertMillimetersToTwip(19),
              header: convertMillimetersToTwip(12),
              footer: convertMillimetersToTwip(12),
            },
          },
        },
        headers: { default: docHeader },
        footers: { default: docFooter },
        children: bodyParagraphs,
      },
    ],
  });

  return await Packer.toBlob(doc);
};

export default function LetterPad() {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);
  const [body, setBody] = useState("");
  const previewRef = useRef<HTMLDivElement | null>(null);

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
    const source = previewRef.current;
    if (!source) return;
    setDownloadingPdf(true);
    // wait for the logo image to finish loading so it renders in the canvas
    const imgs = Array.from(source.querySelectorAll("img"));
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

    // Pad the sheet up to a whole number of A4 pages so long content flows onto
    // additional pages (instead of being clipped) and the footer lands at the
    // bottom of the last page. One A4 page = ~1123px tall at the sheet's 794px width.
    const PAGE_PX = 1123;
    const sheet = source.querySelector(".letterhead-preview") as HTMLElement | null;
    const pageCount = sheet ? Math.max(1, Math.ceil(sheet.scrollHeight / PAGE_PX)) : 1;

    try {
      await html2pdf()
        .from(source)
        .set({
          margin: 0,
          filename: `${FILE_BASE}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            onclone: (doc: Document) => {
              // hide the on-screen "write here" hint in the exported file
              doc.querySelectorAll(".lh-placeholder").forEach((el) => {
                (el as HTMLElement).style.display = "none";
              });
              // pad the cloned sheet to a whole number of pages
              const clonedSheet = doc.querySelector(".letterhead-preview") as HTMLElement | null;
              if (clonedSheet) clonedSheet.style.minHeight = `${pageCount * PAGE_PX}px`;
            },
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          // @ts-expect-error — pagebreak is supported by html2pdf at runtime
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .save();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadWord = async () => {
    setDownloadingWord(true);
    try {
      let logoDataUrl = "";
      try {
        logoDataUrl = await urlToBase64(logo);
      } catch {
        // fall back to a text-only header if the logo can't be embedded
        logoDataUrl = "";
      }
      const icons = await extractHeaderIconPngs(previewRef.current);
      const blob = await buildLetterheadDocx(logoDataUrl, icons, body);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${FILE_BASE}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Word (.docx) letterhead downloaded.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate Word document. Please try again.");
    } finally {
      setDownloadingWord(false);
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
              Enter the password to access the letter pad.
            </p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              autoFocus
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError(false);
              }}
            />
            {authError && (
              <p className="text-xs font-medium text-destructive">Incorrect password. Please try again.</p>
            )}
            <Button type="submit" className="w-full">Unlock</Button>
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
                Company Stationery
              </span>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">Letter Pad</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Type or paste your letter in the editor below — it drops into the letterhead body and both downloads.
                The logo, header and footer stay fixed. Choose PDF (print-ready) or Word (.docx, editable).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="text-xs sm:text-sm"
              >
                {downloadingPdf ? "Generating PDF…" : "Download PDF"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadWord}
                disabled={downloadingWord}
                className="text-xs sm:text-sm"
              >
                {downloadingWord ? "Generating Word…" : "Download Word (.docx)"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} className="text-xs sm:text-sm">
                Print
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-xs sm:text-sm">
                ← Home
              </Button>
            </div>
          </div>
        </section>

        {/* ── Letter content editor (play area) ── */}
        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">
                Letter Content
              </p>
              <h2 className="mt-1 text-xl font-semibold sm:mt-2 sm:text-2xl">Body</h2>
            </div>
            {body && (
              <Button variant="ghost" size="sm" onClick={() => setBody("")} className="text-xs sm:text-sm">
                Clear
              </Button>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Type or paste the letter here. Line breaks are preserved.
          </p>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste or type your letter content here…"
            className="mt-4 min-h-[240px] leading-7"
          />
        </section>

        {/* ── Letterhead preview ── */}
        <section className="overflow-x-auto rounded-[24px] border border-slate-200 bg-slate-100 p-3 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div ref={previewRef} className="shadow-lg">
            <LetterheadPreview
              companyLogoUrl={logo}
              companyName={COMPANY.name}
              companyAddress={COMPANY.address}
              companyGst={COMPANY.gst}
              companyPhone={COMPANY.phone}
              companyEmail={COMPANY.email}
              tagline={COMPANY.tagline}
              since={SINCE}
              body={body}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
