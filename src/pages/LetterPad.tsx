import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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

  // left-aligned so the (equal-width) icons form a column and the values line up
  const rightLine = (children: (TextRun | ImageRun)[]) =>
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 20 }, children });

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
    const sheet = previewRef.current?.querySelector(".letterhead-preview") as HTMLElement | null;
    if (!sheet) return;
    setDownloadingPdf(true);

    try {
      const PAGE_W = 210;
      const PAGE_H = 297;
      const MARGIN = 15;
      const SCALE = 2;
      const PX_TO_MM = PAGE_W / sheet.offsetWidth; // sheet is 794px wide -> 210mm

      // address split (city + pincode stay together on the 2nd line)
      const addrParts = COMPANY.address.split(",").map((s) => s.trim()).filter(Boolean);
      const addrLine1 = addrParts.length > 1 ? addrParts.slice(0, -1).join(", ") : COMPANY.address;
      const addrLine2 = addrParts.length > 1 ? addrParts[addrParts.length - 1] : "";

      // assets: logo, faint watermark, and rasterized contact icons
      let logoImg = "";
      let logoW = 36;
      let logoH = 17;
      let watermarkImg = "";
      let wmRatio = 0.46;
      try {
        const logoDataUrl = await urlToBase64(logo);
        const { width, height } = await getImageSize(logoDataUrl);
        const ratio = height / width || 0.46;
        logoImg = logoDataUrl;
        logoW = 36;
        logoH = logoW * ratio;
        wmRatio = ratio;
        watermarkImg = await makeFadedPng(logoDataUrl, 0.06);
      } catch {
        logoImg = "";
      }
      const icons = await extractHeaderIconPngs(sheet);

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      const HEADER_RULE_Y = 41;
      const ACCENT: [number, number, number] = [37, 99, 235];

      // ── contact block (icons drawn at exact coordinates next to each value) ──
      const drawContacts = (topPad: number) => {
        const iconX = 140;
        const valX = 145;
        const iconSize = 3.3;
        const drawIcon = (img: string, baseY: number) => {
          if (img) pdf.addImage(img, "PNG", iconX, baseY - 1.1 - iconSize / 2, iconSize, iconSize);
        };
        pdf.setFontSize(8.5);
        let cy = topPad + 2.5;

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 116, 139);
        drawIcon(icons.address, cy);
        pdf.text(addrLine1, valX, cy);
        if (addrLine2) pdf.text(addrLine2, valX, cy + 4);
        cy += addrLine2 ? 9 : 5.5;

        drawIcon(icons.gst, cy);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(71, 85, 105);
        pdf.text("GSTIN: ", valX, cy);
        const gw = pdf.getTextWidth("GSTIN: ");
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 116, 139);
        pdf.text(COMPANY.gst, valX + gw, cy);
        cy += 5.5;

        drawIcon(icons.phone, cy);
        pdf.text(COMPANY.phone, valX, cy);
        cy += 5.5;

        drawIcon(icons.email, cy);
        pdf.text(COMPANY.email, valX, cy);
      };

      // ── full letterhead chrome, drawn natively on every page ──
      const drawChrome = () => {
        const topPad = 12;
        if (watermarkImg) {
          const wmW = 120;
          const wmH = wmW * wmRatio;
          pdf.addImage(watermarkImg, "PNG", (PAGE_W - wmW) / 2, (PAGE_H - wmH) / 2, wmW, wmH);
        }
        // logo + company name / tagline / since
        if (logoImg) pdf.addImage(logoImg, "PNG", MARGIN, topPad, logoW, logoH);
        const tx = MARGIN + logoW + 5;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor(15, 23, 42);
        pdf.text(COMPANY.name, tx, topPad + 6.5);
        pdf.setFontSize(11);
        pdf.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
        pdf.text(COMPANY.tagline, tx, topPad + 13);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(148, 163, 184);
        pdf.text(`SINCE ${SINCE}`, tx, topPad + 18, { charSpace: 0.8 });
        // contact block
        drawContacts(topPad);
        // accent rule under the header
        pdf.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
        pdf.setLineWidth(0.7);
        pdf.line(MARGIN, HEADER_RULE_Y, PAGE_W - MARGIN, HEADER_RULE_Y);
        // blue accent bar at the very top
        pdf.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
        pdf.rect(0, 0, PAGE_W, 1.6, "F");
        // footer: divider + centered contact strip
        const footerLineY = PAGE_H - 16;
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.2);
        pdf.line(MARGIN, footerLineY, PAGE_W - MARGIN, footerLineY);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(148, 163, 184);
        pdf.text(
          `${COMPANY.address}   •   Ph: ${COMPANY.phone}   •   ${COMPANY.email}   •   GSTIN: ${COMPANY.gst}`,
          PAGE_W / 2,
          footerLineY + 4,
          { align: "center" }
        );
      };

      // body region between header rule and footer
      const bodyTopMM = HEADER_RULE_Y + 5;
      const bodyBottomMM = PAGE_H - 22;
      const availPx = (bodyBottomMM - bodyTopMM) / PX_TO_MM;

      const bodyEl = sheet.querySelector(".lh-body") as HTMLElement | null;

      if (!bodyEl || bodyEl.children.length === 0) {
        drawChrome(); // empty body -> a single blank letterhead page
      } else {
        // capture only the body text as an image (preserves styling / any chars)
        const bodyCanvas = await html2canvas(bodyEl, {
          scale: SCALE,
          backgroundColor: null,
          useCORS: true,
          logging: false,
        });
        const contentW = bodyEl.offsetWidth * PX_TO_MM;
        const sideMM = (PAGE_W - contentW) / 2;

        // group whole lines into per-page slices so a line is never cut in half
        const bodyTopPx = bodyEl.getBoundingClientRect().top;
        const lines = Array.from(bodyEl.children).map((el) => {
          const r = el.getBoundingClientRect();
          return { top: r.top - bodyTopPx, bottom: r.bottom - bodyTopPx };
        });
        const slices: { start: number; end: number }[] = [];
        let start = lines[0].top;
        let lastEnd = start;
        for (const ln of lines) {
          if (ln.bottom - start > availPx && lastEnd > start) {
            slices.push({ start, end: lastEnd });
            start = ln.top;
          }
          lastEnd = ln.bottom;
        }
        slices.push({ start, end: lastEnd });

        slices.forEach((slice, idx) => {
          if (idx > 0) pdf.addPage();
          drawChrome();
          const sliceHpx = Math.max(1, slice.end - slice.start);
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = bodyCanvas.width;
          sliceCanvas.height = Math.round(sliceHpx * SCALE);
          const ctx = sliceCanvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(
            bodyCanvas,
            0,
            Math.round(slice.start * SCALE),
            bodyCanvas.width,
            sliceCanvas.height,
            0,
            0,
            bodyCanvas.width,
            sliceCanvas.height
          );
          pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", sideMM, bodyTopMM, contentW, sliceHpx * PX_TO_MM);
        });
      }

      pdf.save(`${FILE_BASE}.pdf`);
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
