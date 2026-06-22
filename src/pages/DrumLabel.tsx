import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { toCanvas as htmlToCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
import ChemicalLabel from "@/components/ChemicalLabel";
import ThermalLabel from "@/components/ThermalLabel";
import { productCategories } from "@/data/products";
import { getProductSafety } from "@/data/productSafety";
import "@/components/ChemicalLabel.css";

/* ── Types ─────────────────────────────────────────── */

interface LabelFormData {
  productName: string;
  batchNo: string;
  invoice: string;
  mfgDate: string;
  expDate: string;
  make: string;
  netQty: string;
  tareQty: string;
  grossQty: string;
  qtyUnit: "kgs" | "ltrs";
}

type Step = "select-product" | "fill-form" | "choose-layout" | "preview";

/* ── Component ─────────────────────────────────────── */

const PASS = "laxmichem72";

const MAKE_OPTIONS = [
  "Deepak Fertilisers and Petrochemicals Corporation Limited",
  "Hindustan Organic Chemicals Limited",
  "Gujarat Alkalies and Chemicals Limited",
  "Satyam Petrochemicals",
  "Bharat Petroleum Corporation Limited",
  "Laxmi Organic Industries Ltd",
];

const DrumLabel = () => {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const [step, setStep] = useState<Step>("select-product");
  const [search, setSearch] = useState("");
  const [stickersPerPage, setStickersPerPage] = useState<1 | 2>(1);
  const [thermalSize, setThermalSize] = useState<null | "3x5" | "4x4" | "4x6" | "6x4">(null);
  const [copies, setCopies] = useState(1);
  // The thermal preview IS the generated image, so what you see === what downloads.
  const [thermalUrl, setThermalUrl] = useState<string | null>(null);
  const [thermalDims, setThermalDims] = useState<{ wIn: number; hIn: number } | null>(null);
  const [form, setForm] = useState<LabelFormData>({
    productName: "",
    batchNo: "",
    invoice: "",
    mfgDate: "",
    expDate: "",
    make: "",
    netQty: "",
    tareQty: "",
    grossQty: "",
    qtyUnit: "kgs",
  });

  /* ── Helpers ───────────────────────────────────────── */

  const filteredCategories = productCategories
    .map((cat) => ({
      ...cat,
      products: cat.products.filter((p) =>
        p.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.products.length > 0);

  const handleSelectProduct = (name: string) => {
    setForm((prev) => ({ ...prev, productName: name }));
    setStep("fill-form");
  };

  const handleFormChange = (field: keyof LabelFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("choose-layout");
  };

  const handlePrint = () => {
    // For thermal: print the SAME generated image that is shown/downloaded,
    // so the print exactly matches the preview.
    if (thermalSize && thermalUrl) {
      const pageSize =
        thermalSize === "3x5"
          ? "3in 5in"
          : thermalSize === "4x4"
          ? "4in 4in"
          : thermalSize === "6x4"
          ? "6in 4in"
          : "4in 6in";
      const count = Math.max(1, Math.min(99, Math.floor(copies) || 1));
      // One label image per page, repeated for the requested number of copies.
      const pages = Array.from({ length: count })
        .map(() => `<img class="label-copy" src="${thermalUrl}" />`)
        .join("");
      const w = window.open("", "_blank", "noopener,noreferrer");
      if (!w) return;
      const style = `@page { size: ${pageSize}; margin: 0; } html,body{ margin:0; padding:0; } .label-copy{ display:block; width:100%; height:100%; object-fit:contain; break-after: page; page-break-after: always; } .label-copy:last-child{ break-after: auto; page-break-after: auto; }`;
      w.document.write(`<!doctype html><html><head><meta charset=\"utf-8\"><title>Label</title><style>${style}</style></head><body>${pages}</body></html>`);
      w.document.close();
      w.focus();
      const imgs = Array.from(w.document.images);
      const ready = Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
              })
        )
      );
      Promise.race([ready, new Promise((r) => setTimeout(r, 1000))]).then(() => {
        w.focus();
        w.print();
        w.close();
      });
      return;
    }
    window.print();
  };

  const handleDownloadPdf = async () => {
    const source = previewRef.current;
    if (!source) return;
    setDownloading(true);

    const safeProduct = (form.productName || "label").replace(/[^\w-]+/g, "_");
    const filename = `${safeProduct}_drum_label.pdf`;

    // Wait for images to load before capture
    const imgs = Array.from(source.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            })
      )
    );

    // Print-equivalent CSS injected into the html2canvas clone so the PDF
    // renders the same A4 layout the @media print rules produce.
    //
    // html2canvas has limited support for `clip-path` and some flex tricks,
    // so we force an explicit column layout and rectangular banners with
    // the product name / MSDS text hard-centered.
    const printCss = `
      body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }

      /* Undo any mobile CSS scaling transforms and lock column layout */
      .cl {
        transform: none !important;
        width: 650px !important;
        max-width: none !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }

      /* Header banner — product name, top */
      .cl__header {
        clip-path: none !important;
        -webkit-clip-path: none !important;
        background: #C8102E !important;
        height: 46px !important;
        flex: 0 0 46px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        padding: 0 24px !important;
        order: 1 !important;
      }
      .cl__header-text {
        color: #ffffff !important;
        display: inline-block !important;
        width: 100% !important;
        text-align: center !important;
        font-family: "Arial Black", "Helvetica Neue", Impact, sans-serif !important;
        font-size: 28px !important;
        font-weight: 900 !important;
        font-style: normal !important;
        letter-spacing: 4px !important;
        line-height: 1 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35) !important;
      }

      /* Body between banners */
      .cl__body {
        flex: 1 1 auto !important;
        order: 2 !important;
      }

      /* Footer banner — MSDS, bottom */
      .cl__footer {
        clip-path: none !important;
        -webkit-clip-path: none !important;
        background: #C8102E !important;
        height: 34px !important;
        flex: 0 0 34px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        padding: 0 20px !important;
        order: 3 !important;
      }
      .cl__footer-text {
        color: #ffffff !important;
        display: inline-block !important;
        width: 100% !important;
        text-align: center !important;
        font-size: 12px !important;
        font-weight: 800 !important;
        letter-spacing: 2px !important;
        line-height: 1 !important;
      }

      /* Single label layout — matches @media print .label-preview */
      .label-preview {
        display: block !important;
        width: 100% !important;
        padding: 10mm 0 !important;
        margin: 0 !important;
        background: #ffffff !important;
      }

      /* A4 two-up sheet — strip on-screen chrome, match print look */
      .a4-sheet {
        width: 100% !important;
        aspect-ratio: auto !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 6mm 8mm !important;
        background: #ffffff !important;
      }
      .a4-sheet__meta-top,
      .a4-sheet__meta-bottom,
      .a4-sheet__crop {
        display: none !important;
      }
      .a4-sheet__inner {
        width: 100% !important;
        overflow: visible !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 8mm !important;
      }
      .a4-sheet__inner .cl {
        margin: 0 auto !important;
      }

      /* Wrapper page itself */
      .drum-label-page {
        padding: 0 !important;
        margin: 0 !important;
        gap: 0 !important;
        background: #ffffff !important;
        overflow: visible !important;
      }
    `;

    try {
      await html2pdf()
        .from(source)
        .set({
          margin: 0,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            windowWidth: 820,
            logging: false,
            onclone: (clonedDoc: Document) => {
              const style = clonedDoc.createElement("style");
              style.textContent = printCss;
              clonedDoc.head.appendChild(style);

              // Physically remove on-screen-only chrome so it can't appear in the PDF
              clonedDoc
                .querySelectorAll(
                  ".a4-sheet__meta-top, .a4-sheet__meta-bottom, .a4-sheet__crop"
                )
                .forEach((el) => el.remove());

              // Strip the a4-sheet styling wrapper entirely — keep only its labels
              clonedDoc.querySelectorAll<HTMLElement>(".a4-sheet").forEach((el) => {
                el.style.border = "none";
                el.style.boxShadow = "none";
                el.style.borderRadius = "0";
                el.style.padding = "0";
                el.style.aspectRatio = "auto";
                el.style.background = "#ffffff";
              });
            },
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    } catch (err) {
      console.error("PDF download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleStartOver = () => {
    setStep("select-product");
    setSearch("");
    setForm({
      productName: "",
      batchNo: "",
      invoice: "",
      mfgDate: "",
      expDate: "",
      make: "",
      netQty: "",
      tareQty: "",
      grossQty: "",
      qtyUnit: "kgs",
    });
    setStickersPerPage(1);
    setThermalSize(null);
    setCopies(1);
  };

  const withUnit = (v: string) => (v ? `${v} ${form.qtyUnit}` : "");

  const labelProps = {
    productName: form.productName,
    batchNo: form.batchNo,
    invoice: form.invoice,
    mfgDate: formatDate(form.mfgDate),
    expDate: formatDate(form.expDate),
    make: form.make,
    netQty: withUnit(form.netQty),
    tareQty: withUnit(form.tareQty),
    grossQty: withUnit(form.grossQty),
    safety: getProductSafety(form.productName),
  };

  // Shared props for the thermal label (preview + export render)
  const thermalProps = {
    productName: form.productName || "Product",
    invoice: form.invoice,
    batchNo: form.batchNo,
    mfgDate: labelProps.mfgDate,
    expDate: labelProps.expDate,
    make: form.make,
    netQty: labelProps.netQty,
    tareQty: labelProps.tareQty,
    grossQty: labelProps.grossQty,
    safety: labelProps.safety,
  };

  /* ── Thermal export (SEZNIK Shakti 4×6, 203 DPI) ─────
     html2canvas can't reliably capture content that sits under a CSS-rotated
     ancestor (the text collapses). So we snapshot a separate, hidden, NON-
     rotated landscape copy at the printer's native 203 DPI, then rotate the
     bitmap for portrait media. */
  const THERMAL_LANDSCAPE: Record<string, "3x5" | "4x4" | "4x6" | "6x4" | "5x3"> = {
    "3x5": "5x3",
    "4x4": "4x4",
    "4x6": "6x4",
    "6x4": "6x4",
  };
  const THERMAL_INCHES: Record<string, [number, number]> = {
    "3x5": [3, 5],
    "4x4": [4, 4],
    "4x6": [4, 6],
    "6x4": [6, 4],
  };

  const captureThermalCanvas = async (): Promise<
    { canvas: HTMLCanvasElement; wIn: number; hIn: number } | null
  > => {
    const el = exportRef.current?.querySelector<HTMLElement>(".thermal-label");
    if (!el || !thermalSize) return null;

    // Wait for the logo to finish loading
    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>("img"));
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            })
      )
    );

    // html-to-image rasterises through the BROWSER's own layout engine (SVG
    // foreignObject), so flexbox fills exactly as it does on screen — unlike
    // html2canvas which re-implements layout and ignored flex-grow.
    const raw = await htmlToCanvas(el, {
      pixelRatio: 203 / 96, // the printer's native 203 DPI
      backgroundColor: "#ffffff",
      width: el.offsetWidth,
      height: el.offsetHeight,
      cacheBust: true,
    });

    const [wIn, hIn] = THERMAL_INCHES[thermalSize];
    if (hIn <= wIn) return { canvas: raw, wIn, hIn }; // landscape / square — no turn

    // Portrait media: rotate the landscape bitmap 90° clockwise
    const out = document.createElement("canvas");
    out.width = raw.height;
    out.height = raw.width;
    const ctx = out.getContext("2d");
    if (!ctx) return { canvas: raw, wIn, hIn };
    ctx.translate(out.width / 2, out.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(raw, -raw.width / 2, -raw.height / 2);
    return { canvas: out, wIn, hIn };
  };

  const safeName = () => (form.productName || "label").replace(/[^\w-]+/g, "_");

  // Build the thermal label image once on the preview step — this exact image
  // is shown AND downloaded/printed, so the preview can never differ from the file.
  useEffect(() => {
    if (step !== "preview" || !thermalSize) {
      setThermalUrl(null);
      setThermalDims(null);
      return;
    }
    let cancelled = false;
    setThermalUrl(null);
    (async () => {
      // let the hidden render mount/paint first
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const result = await captureThermalCanvas();
      if (!cancelled && result) {
        setThermalUrl(result.canvas.toDataURL("image/png"));
        setThermalDims({ wIn: result.wIn, hIn: result.hIn });
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, thermalSize, JSON.stringify(thermalProps)]);

  const handleDownloadThermalPng = () => {
    if (!thermalUrl) return;
    const a = document.createElement("a");
    a.href = thermalUrl;
    a.download = `${safeName()}_${thermalSize}_thermal.png`;
    a.click();
  };

  const handleDownloadThermalPdf = () => {
    if (!thermalUrl || !thermalDims) return;
    const { wIn, hIn } = thermalDims;
    const orientation = wIn > hIn ? "landscape" : "portrait";
    const pdf = new jsPDF({ orientation, unit: "in", format: [wIn, hIn] });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const count = Math.max(1, Math.min(99, Math.floor(copies) || 1));
    for (let i = 0; i < count; i++) {
      if (i > 0) pdf.addPage([wIn, hIn], orientation);
      pdf.addImage(thermalUrl, "PNG", 0, 0, pw, ph);
    }
    pdf.save(`${safeName()}_${thermalSize}_thermal.pdf`);
  };

  /* ── Step Indicator ────────────────────────────────── */

  const steps: { key: Step; label: string }[] = [
    { key: "select-product", label: "Select Product" },
    { key: "fill-form", label: "Fill Details" },
    { key: "choose-layout", label: "Layout" },
    { key: "preview", label: "Preview" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === step);

  /* ── Render ────────────────────────────────────────── */

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASS) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  if (!authenticated) {
    return (
      <div className="drum-label-page">
        <div className="wizard-card" style={{ textAlign: "center", maxWidth: 400 }}>
          <h2 className="wizard-card__title">Restricted Access</h2>
          <p style={{ fontSize: 13, color: "#666", margin: "8px 0 20px" }}>
            Enter the password to access the label generator.
          </p>
          <form onSubmit={handleAuth}>
            <input
              className="label-form__input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
              style={{ width: "100%", marginBottom: 12, boxSizing: "border-box" }}
              autoFocus
            />
            {authError && (
              <p style={{ color: "#C8102E", fontSize: 12, margin: "0 0 10px" }}>
                Incorrect password. Please try again.
              </p>
            )}
            <button type="submit" className="drum-label-page__btn drum-label-page__btn--print" style={{ width: "100%" }}>
              Unlock
            </button>
          </form>
          <button
            className="drum-label-page__btn drum-label-page__btn--back"
            onClick={() => navigate("/")}
            style={{ marginTop: 12, width: "100%" }}
          >
            &larr; Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="drum-label-page">
      {/* Toolbar */}
      <div className="drum-label-page__toolbar">
        <button
          className="drum-label-page__btn drum-label-page__btn--back"
          onClick={() => navigate("/")}
        >
          &larr; Back to Home
        </button>
        {step !== "select-product" && step !== "preview" && (
          <button
            className="drum-label-page__btn drum-label-page__btn--back"
            onClick={() => {
              const prev = steps[currentIndex - 1];
              if (prev) setStep(prev.key);
            }}
          >
            &larr; Previous Step
          </button>
        )}
        {step === "preview" && (
          <>
            <button
              className="drum-label-page__btn drum-label-page__btn--back"
              onClick={handleStartOver}
            >
              New Label
            </button>
            {!thermalSize && (
              <button
                className="drum-label-page__btn drum-label-page__btn--back"
                onClick={handleDownloadPdf}
                disabled={downloading}
              >
                {downloading ? "Generating..." : "\u2B07 Download PDF"}
              </button>
            )}
            {thermalSize && (
              <>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  Copies
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={copies}
                    onChange={(e) =>
                      setCopies(Math.max(1, Math.min(99, Math.floor(Number(e.target.value)) || 1)))
                    }
                    style={{
                      width: 56,
                      padding: "6px 8px",
                      border: "1px solid #ccc",
                      borderRadius: 6,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  />
                </label>
                <button
                  className="drum-label-page__btn drum-label-page__btn--back"
                  onClick={handleDownloadThermalPng}
                  disabled={downloading}
                  title="Best for the SEZNIK app \u2014 exact label size at 203 DPI"
                >
                  {downloading ? "Generating..." : "\u2B07 PNG (for app)"}
                </button>
                <button
                  className="drum-label-page__btn drum-label-page__btn--back"
                  onClick={handleDownloadThermalPdf}
                  disabled={downloading}
                >
                  {downloading ? "Generating..." : "\u2B07 PDF"}
                </button>
              </>
            )}
            <button
              className="drum-label-page__btn drum-label-page__btn--print"
              onClick={handlePrint}
            >
              {thermalSize && copies > 1 ? `Print ${copies} Labels` : "Print Label"}
            </button>
          </>
        )}
      </div>

      {/* Step Indicator */}
      <div className="wizard-steps">
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={`wizard-step ${i <= currentIndex ? "wizard-step--active" : ""} ${i < currentIndex ? "wizard-step--done" : ""}`}
          >
            <div className="wizard-step__circle">{i < currentIndex ? "\u2713" : i + 1}</div>
            <span className="wizard-step__label">{s.label}</span>
            {i < steps.length - 1 && <div className="wizard-step__line" />}
          </div>
        ))}
      </div>

      {/* ── Step 1: Select Product ───────────────────── */}
      {step === "select-product" && (
        <div className="wizard-card">
          <h2 className="wizard-card__title">Select a Product</h2>
          <input
            type="text"
            className="wizard-search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="product-picker">
            {filteredCategories.map((cat) => (
              <div key={cat.title} className="product-picker__category">
                <div className="product-picker__category-header">
                  <span className="product-picker__icon">{cat.icon}</span>
                  <span className="product-picker__category-name">{cat.title}</span>
                </div>
                <div className="product-picker__list">
                  {cat.products.map((p) => (
                    <button
                      key={p}
                      className={`product-picker__item ${form.productName === p ? "product-picker__item--selected" : ""}`}
                      onClick={() => handleSelectProduct(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <p className="product-picker__empty">No products match &ldquo;{search}&rdquo;</p>
            )}
          </div>
        </div>
      )}

      {/* ── Step 2: Fill Form ────────────────────────── */}
      {step === "fill-form" && (
        <div className="wizard-card">
          <h2 className="wizard-card__title">
            Label Details for <span className="wizard-card__highlight">{form.productName}</span>
          </h2>

          <form className="label-form" onSubmit={handleFormSubmit}>
            <div className="label-form__row">
              <label className="label-form__label">Invoice</label>
              <input
                className="label-form__input"
                placeholder="e.g. 4176"
                value={form.invoice}
                onChange={(e) => handleFormChange("invoice", e.target.value)}
              />
            </div>

            <div className="label-form__row">
              <label className="label-form__label">Batch No.</label>
              <input
                className="label-form__input"
                placeholder="e.g. B-1726 (optional)"
                value={form.batchNo}
                onChange={(e) => handleFormChange("batchNo", e.target.value)}
              />
            </div>

            <div className="label-form__row">
              <label className="label-form__label">MFG Date</label>
              <input
                className="label-form__input"
                type="date"
                value={form.mfgDate}
                onChange={(e) => handleFormChange("mfgDate", e.target.value)}
              />
            </div>

            <div className="label-form__row">
              <label className="label-form__label">Exp Date</label>
              <input
                className="label-form__input"
                type="date"
                value={form.expDate}
                onChange={(e) => handleFormChange("expDate", e.target.value)}
              />
            </div>

            <div className="label-form__row">
              <label className="label-form__label">Make</label>
              <select
                className="label-form__input"
                value={MAKE_OPTIONS.includes(form.make) ? form.make : (form.make ? "__custom__" : "")}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__custom__") {
                    handleFormChange("make", form.make && !MAKE_OPTIONS.includes(form.make) ? form.make : "");
                  } else {
                    handleFormChange("make", v);
                  }
                }}
                style={{ marginBottom: 6 }}
              >
                <option value="">-- Select manufacturer --</option>
                {MAKE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                <option value="__custom__">Other (enter custom name)</option>
              </select>
              <input
                className="label-form__input"
                placeholder="Or type a custom manufacturer name"
                value={form.make}
                onChange={(e) => handleFormChange("make", e.target.value)}
              />
            </div>

            <div className="label-form__row">
              <label className="label-form__label">Quantity (optional)</label>
              <div
                className={`label-form__qty-row ${form.qtyUnit === "ltrs" ? "label-form__qty-row--ltrs" : ""}`}
              >
                <input
                  className="label-form__input"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="Net"
                  value={form.netQty}
                  onChange={(e) => {
                    const net = e.target.value;
                    setForm((prev) => {
                      if (prev.qtyUnit === "ltrs") {
                        return { ...prev, netQty: net };
                      }
                      const n = parseFloat(net);
                      const t = parseFloat(prev.tareQty);
                      const gross = !isNaN(n) && !isNaN(t) ? String(+(n + t).toFixed(2)) : prev.grossQty;
                      return { ...prev, netQty: net, grossQty: gross };
                    });
                  }}
                />
                {form.qtyUnit === "kgs" && (
                  <>
                    <input
                      className="label-form__input"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="Tare"
                      value={form.tareQty}
                      onChange={(e) => {
                        const tare = e.target.value;
                        setForm((prev) => {
                          const n = parseFloat(prev.netQty);
                          const t = parseFloat(tare);
                          const gross = !isNaN(n) && !isNaN(t) ? String(+(n + t).toFixed(2)) : prev.grossQty;
                          return { ...prev, tareQty: tare, grossQty: gross };
                        });
                      }}
                    />
                    <input
                      className="label-form__input"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="Gross (auto)"
                      value={form.grossQty}
                      onChange={(e) => handleFormChange("grossQty", e.target.value)}
                      title="Auto-calculated from Net + Tare, but you can override"
                    />
                  </>
                )}
                <select
                  className="label-form__input"
                  value={form.qtyUnit}
                  onChange={(e) => {
                    const unit = e.target.value as "kgs" | "ltrs";
                    setForm((prev) =>
                      unit === "ltrs"
                        ? { ...prev, qtyUnit: unit, tareQty: "", grossQty: "" }
                        : { ...prev, qtyUnit: unit }
                    );
                  }}
                >
                  <option value="kgs">kgs</option>
                  <option value="ltrs">ltrs</option>
                </select>
              </div>
            </div>

            <button type="submit" className="drum-label-page__btn drum-label-page__btn--print" style={{ marginTop: 12 }}>
              Next &rarr; Choose Layout
            </button>
          </form>
        </div>
      )}

      {/* ── Step 3: Choose Layout ────────────────────── */}
      {step === "choose-layout" && (
        <div className="wizard-card">
          <h2 className="wizard-card__title">How many stickers per page?</h2>
          <p className="wizard-card__subtitle">Choose a layout before printing</p>

          <div className="layout-picker">
            <button
              className={`layout-picker__option ${!thermalSize && stickersPerPage === 1 ? "layout-picker__option--active" : ""}`}
              onClick={() => {
                setStickersPerPage(1);
                setThermalSize(null);
              }}
            >
              <div className="layout-picker__preview layout-picker__preview--single">
                <div className="layout-picker__mini-label" />
              </div>
              <span className="layout-picker__text">1 Sticker</span>
              <span className="layout-picker__desc">Full-size, single label</span>
            </button>

            <button
              className={`layout-picker__option ${!thermalSize && stickersPerPage === 2 ? "layout-picker__option--active" : ""}`}
              onClick={() => {
                setStickersPerPage(2);
                setThermalSize(null);
              }}
            >
              <div className="layout-picker__preview layout-picker__preview--double">
                <div className="layout-picker__mini-label" />
                <div className="layout-picker__mini-label" />
              </div>
              <span className="layout-picker__text">2 Stickers</span>
              <span className="layout-picker__desc">A4 sheet, vertical, cut line</span>
            </button>
          </div>

          <h3 className="wizard-card__title" style={{ fontSize: 16, marginTop: 24 }}>
            Thermal Printer Label
          </h3>
          <p className="wizard-card__subtitle">Roll-fed thermal sizes &bull; set the number of copies before printing</p>

          <div className="layout-picker">
            <button
              className={`layout-picker__option ${thermalSize === "3x5" ? "layout-picker__option--active" : ""}`}
              onClick={() => {
                setThermalSize("3x5");
                setStickersPerPage(1);
              }}
            >
              <div className="layout-picker__preview layout-picker__preview--single">
                <div className="layout-picker__mini-label" />
              </div>
              <span className="layout-picker__text">Thermal 3 × 5</span>
              <span className="layout-picker__desc">Thermal printer label (3in × 5in)</span>
            </button>

            <button
              className={`layout-picker__option ${thermalSize === "4x4" ? "layout-picker__option--active" : ""}`}
              onClick={() => {
                setThermalSize("4x4");
                setStickersPerPage(1);
              }}
            >
              <div className="layout-picker__preview layout-picker__preview--single">
                <div className="layout-picker__mini-label" />
              </div>
              <span className="layout-picker__text">Thermal 4 × 4</span>
              <span className="layout-picker__desc">Thermal printer label (4in × 4in)</span>
            </button>

            <button
              className={`layout-picker__option ${thermalSize === "4x6" ? "layout-picker__option--active" : ""}`}
              onClick={() => {
                setThermalSize("4x6");
                setStickersPerPage(1);
              }}
            >
              <div className="layout-picker__preview layout-picker__preview--single">
                <div className="layout-picker__mini-label" />
              </div>
              <span className="layout-picker__text">Thermal 4 × 6 ✓</span>
              <span className="layout-picker__desc">Recommended — SEZNIK Shakti 4×6 (4in × 6in, 203 DPI)</span>
            </button>

            <button
              className={`layout-picker__option ${thermalSize === "6x4" ? "layout-picker__option--active" : ""}`}
              onClick={() => {
                setThermalSize("6x4");
                setStickersPerPage(1);
              }}
            >
              <div className="layout-picker__preview layout-picker__preview--single">
                <div className="layout-picker__mini-label" />
              </div>
              <span className="layout-picker__text">Thermal 6 × 4</span>
              <span className="layout-picker__desc">Landscape (6in × 4in) — needs 6in-wide stock</span>
            </button>
          </div>

          <button
            className="drum-label-page__btn drum-label-page__btn--print"
            style={{ marginTop: 16 }}
            onClick={() => setStep("preview")}
          >
            Generate Label &rarr;
          </button>
        </div>
      )}

      {/* ── Step 4: Preview (single) ─────────────────── */}
      {step === "preview" && !thermalSize && stickersPerPage === 1 && (
        <div className="label-preview" ref={previewRef}>
          <ChemicalLabel {...labelProps} />
        </div>
      )}

      {/* ── Step 4: Preview (2-up A4 sheet) ──────────── */}
      {step === "preview" && !thermalSize && stickersPerPage === 2 && (
        <div className="a4-sheet" ref={previewRef}>
          <div className="a4-sheet__meta-top">
            <span>A4 &bull; 210 &times; 297 mm &bull; Portrait &bull; 2 labels / sheet &bull; Laxmi Chemicals</span>
            <span>{form.productName} &bull; Print at 100% &bull; CMYK</span>
          </div>

          <div className="a4-sheet__inner">
            <div className="a4-sheet__crop a4-sheet__crop--tl" />
            <div className="a4-sheet__crop a4-sheet__crop--tr" />
            <div className="a4-sheet__crop a4-sheet__crop--bl" />
            <div className="a4-sheet__crop a4-sheet__crop--br" />

            <ChemicalLabel {...labelProps} />

            <div className="a4-sheet__cut">
              <div className="a4-sheet__cut-line" />
              {/* <div className="a4-sheet__cut-text">
                <span className="a4-sheet__scissors">{"\u2702"}</span>
                <span>CUT HERE</span>
              </div> */}
              <div className="a4-sheet__cut-line" />
            </div>

            <ChemicalLabel {...labelProps} />
          </div>

          <div className="a4-sheet__meta-bottom">
            &bull; BLEED 3 mm &bull; SAFE AREA 5 mm &bull; DIE-CUT ROUND 6 mm &bull;
          </div>
        </div>
      )}

        {/* ── Step 4: Preview (Thermal labels) ─────────── */}
        {step === "preview" && thermalSize && (
          <>
            {/* The preview IS the generated image → it can't differ from the file. */}
            <div className="label-preview" ref={previewRef}>
              {thermalUrl ? (
                <img
                  src={thermalUrl}
                  alt={`${form.productName} label`}
                  style={{
                    width: `${THERMAL_INCHES[thermalSize][0]}in`,
                    height: `${THERMAL_INCHES[thermalSize][1]}in`,
                    display: "block",
                    background: "#fff",
                    boxShadow: "0 2px 14px rgba(0,0,0,0.18)",
                  }}
                />
              ) : (
                <div style={{ padding: 48, color: "#666", fontSize: 14 }}>
                  Generating label…
                </div>
              )}
            </div>

            {/* Hidden, NON-rotated landscape copy — captured for the crisp
                203 DPI image (no CSS-transform ancestor to garble it). */}
            <div
              aria-hidden
              style={{ position: "absolute", left: -99999, top: 0, pointerEvents: "none" }}
            >
              <div ref={exportRef}>
                <ThermalLabel
                  {...thermalProps}
                  size={THERMAL_LANDSCAPE[thermalSize]}
                  rotate={false}
                />
              </div>
            </div>
          </>
        )}
    </div>
  );
};

/** Convert yyyy-mm-dd → "d/m/yyyy" */
function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${parseInt(d)}/${parseInt(m)}/${y}`;
}

export default DrumLabel;
