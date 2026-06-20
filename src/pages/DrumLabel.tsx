import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
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
  const [downloading, setDownloading] = useState(false);

  const [step, setStep] = useState<Step>("select-product");
  const [search, setSearch] = useState("");
  const [stickersPerPage, setStickersPerPage] = useState<1 | 2>(1);
  const [thermalSize, setThermalSize] = useState<null | "3x5" | "4x4" | "4x6">(null);
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
    // If a thermal size is selected, open a focused print window sized for the label
    if (thermalSize && previewRef.current) {
      const content = previewRef.current.innerHTML;
      const pageSize =
        thermalSize === "3x5" ? "3in 5in" : thermalSize === "4x4" ? "4in 4in" : "4in 6in";
      const w = window.open("", "_blank", "noopener,noreferrer");
      if (!w) return;
      // <base> lets the logo's bundled path resolve inside the blank print window.
      const base = `<base href="${window.location.origin}/">`;
      const style = `@page { size: ${pageSize}; margin: 0; } body{ margin:0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }`;
      w.document.write(`<!doctype html><html><head><meta charset=\"utf-8\">${base}<title>Label</title><style>${style}</style></head><body>${content}</body></html>`);
      w.document.close();
      w.focus();
      // Wait for the logo image to load before printing, with a timeout fallback.
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
      Promise.race([ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
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
            <button
              className="drum-label-page__btn drum-label-page__btn--back"
              onClick={handleDownloadPdf}
              disabled={downloading}
            >
              {downloading ? "Generating..." : "\u2B07 Download PDF"}
            </button>
            <button
              className="drum-label-page__btn drum-label-page__btn--print"
              onClick={handlePrint}
            >
              Print Label
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
          <p className="wizard-card__subtitle">Roll-fed thermal sizes (1 label per print)</p>

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
              <span className="layout-picker__text">Thermal 4 × 6</span>
              <span className="layout-picker__desc">Thermal printer label (4in × 6in)</span>
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
          <div className="label-preview" ref={previewRef}>
            <ThermalLabel
              productName={form.productName || "Product"}
              invoice={form.invoice}
              batchNo={form.batchNo}
              mfgDate={labelProps.mfgDate}
              expDate={labelProps.expDate}
              make={form.make}
              netQty={labelProps.netQty}
              tareQty={labelProps.tareQty}
              grossQty={labelProps.grossQty}
              safety={labelProps.safety}
              size={thermalSize}
            />
          </div>
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
