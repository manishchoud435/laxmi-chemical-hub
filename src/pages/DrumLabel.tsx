import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChemicalLabel from "@/components/ChemicalLabel";
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
}

type Step = "select-product" | "fill-form" | "choose-layout" | "preview";

/* ── Component ─────────────────────────────────────── */

const DrumLabel = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("select-product");
  const [search, setSearch] = useState("");
  const [stickersPerPage, setStickersPerPage] = useState<1 | 2>(1);
  const [form, setForm] = useState<LabelFormData>({
    productName: "",
    batchNo: "",
    invoice: "",
    mfgDate: "",
    expDate: "",
    make: "",
    netQty: "",
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

  const handlePrint = () => window.print();

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
    });
    setStickersPerPage(1);
  };

  const labelProps = {
    productName: form.productName,
    batchNo: form.batchNo,
    invoice: form.invoice,
    mfgDate: formatDate(form.mfgDate),
    expDate: formatDate(form.expDate),
    make: form.make,
    netQty: form.netQty,
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
              <label className="label-form__label">
                Invoice <span className="label-form__req">*</span>
              </label>
              <input
                className="label-form__input"
                required
                placeholder="e.g. IPA / 176"
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
              <label className="label-form__label">
                MFG Date <span className="label-form__req">*</span>
              </label>
              <input
                className="label-form__input"
                type="date"
                required
                value={form.mfgDate}
                onChange={(e) => handleFormChange("mfgDate", e.target.value)}
              />
            </div>

            <div className="label-form__row">
              <label className="label-form__label">
                Exp Date <span className="label-form__req">*</span>
              </label>
              <input
                className="label-form__input"
                type="date"
                required
                value={form.expDate}
                onChange={(e) => handleFormChange("expDate", e.target.value)}
              />
            </div>

            <div className="label-form__row">
              <label className="label-form__label">
                Make <span className="label-form__req">*</span>
              </label>
              <input
                className="label-form__input"
                required
                placeholder="e.g. DEEPAK FERTILIZER PETROCHEMICAL CORPORATION LTD"
                value={form.make}
                onChange={(e) => handleFormChange("make", e.target.value)}
              />
            </div>

            <div className="label-form__row">
              <label className="label-form__label">Net Qty</label>
              <input
                className="label-form__input"
                placeholder="e.g. 50 Kg (optional)"
                value={form.netQty}
                onChange={(e) => handleFormChange("netQty", e.target.value)}
              />
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
              className={`layout-picker__option ${stickersPerPage === 1 ? "layout-picker__option--active" : ""}`}
              onClick={() => setStickersPerPage(1)}
            >
              <div className="layout-picker__preview layout-picker__preview--single">
                <div className="layout-picker__mini-label" />
              </div>
              <span className="layout-picker__text">1 Sticker</span>
              <span className="layout-picker__desc">Full-size, single label</span>
            </button>

            <button
              className={`layout-picker__option ${stickersPerPage === 2 ? "layout-picker__option--active" : ""}`}
              onClick={() => setStickersPerPage(2)}
            >
              <div className="layout-picker__preview layout-picker__preview--double">
                <div className="layout-picker__mini-label" />
                <div className="layout-picker__mini-label" />
              </div>
              <span className="layout-picker__text">2 Stickers</span>
              <span className="layout-picker__desc">A4 sheet, vertical, cut line</span>
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
      {step === "preview" && stickersPerPage === 1 && (
        <div className="label-preview">
          <ChemicalLabel {...labelProps} />
        </div>
      )}

      {/* ── Step 4: Preview (2-up A4 sheet) ──────────── */}
      {step === "preview" && stickersPerPage === 2 && (
        <div className="a4-sheet">
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
              <div className="a4-sheet__cut-text">
                <span className="a4-sheet__scissors">{"\u2702"}</span>
                <span>CUT HERE</span>
              </div>
              <div className="a4-sheet__cut-line" />
            </div>

            <ChemicalLabel {...labelProps} />
          </div>

          <div className="a4-sheet__meta-bottom">
            &bull; BLEED 3 mm &bull; SAFE AREA 5 mm &bull; DIE-CUT ROUND 6 mm &bull;
          </div>
        </div>
      )}
    </div>
  );
};

/** Convert yyyy-mm-dd → "d/m/yyyy" */
function formatDate(isoDate: string): string {
  if (!isoDate) return "\u2014";
  const [y, m, d] = isoDate.split("-");
  return `${parseInt(d)}/${parseInt(m)}/${y}`;
}

export default DrumLabel;
