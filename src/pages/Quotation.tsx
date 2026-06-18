import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import html2pdf from "html2pdf.js";
import { NotepadText } from "lucide-react";
import logo from "@/assets/laxmi-chemicals-logo.png";
import { COMPANY } from "@/data/company";
import { productCategories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { BuyerAutocomplete } from "@/components/quotation/BuyerAutocomplete";
import {
  QuotationPreview,
  type QuotationProductItem,
  type DocType,
  PAYMENT_TERMS_OPTIONS,
  DELIVERY_TERMS_OPTIONS,
  VALIDITY_OPTIONS,
  AUTHORIZED_SIGNATORY_DEFAULT,
  QUOTATION_PLACEHOLDER,
  PROFORMA_PLACEHOLDER,
} from "@/components/quotation/QuotationPreview";

const quotationSchema = z.object({
  quotationNo:      z.string().optional(),
  quotationDate:    z.string().optional(),
  buyerName:        z.string().min(1, "Buyer name is required."),
  contactName:      z.string().optional(),
  mobile:           z.string().optional().refine((value) => !value || /^[0-9+\s-]{7,20}$/.test(value), { message: "Enter a valid mobile number." }),
  email:            z.string().optional().refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), { message: "Enter a valid email address." }),
  gstNumber:        z.string().optional().refine((value) => !value || /^[0-9A-Z]{15}$/.test(value), { message: "GSTIN should be 15 characters." }),
  billingAddress:   z.string().optional(),
  shippingAddress:  z.string().optional(),
  city:             z.string().optional(),
  state:            z.string().optional(),
  pincode:          z.string().optional().refine((value) => !value || /^\d{6}$/.test(value), { message: "Pincode should be 6 digits." }),
  paymentTerms:     z.string().optional(),
  deliveryTerms:    z.string().optional(),
  leadTime:         z.string().optional(),
  insurance:        z.string().optional(),
  validity:         z.string().optional(),
  remarks:          z.string().optional(),
  sealName:         z.string().optional(),
  signBy:           z.string().optional(),
  products: z
    .array(
      z.object({
        productName: z.string().min(1, "Select a product."),
        quantity:    z.number().optional(),
        unit:        z.string().optional(),
        rate:        z.number().optional(),
        gst:         z.number().optional(),
        hsn:         z.string().optional(),
        packing:     z.string().optional(),
      })
    )
    .min(1, "Add at least one product."),
});

type QuotationFormValues = z.infer<typeof quotationSchema>;

const PASS        = "laxmichem72";
const STORAGE_KEY = "quotation-draft-v3";

const getTodayDate = (): string => {
  const today = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

// Generate a document number using the same prefix as the placeholders
const generateDocNumber = (isProforma: boolean) => {
  const src = isProforma ? PROFORMA_PLACEHOLDER : QUOTATION_PLACEHOLDER;
  const idx = src.lastIndexOf("/") + 1;
  const prefix = src.slice(0, idx);
  const suffix = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `${prefix}${suffix}`;
};

const defaultValues: QuotationFormValues = {
  quotationNo:     "",
  quotationDate:   getTodayDate(),
  buyerName:       "",
  contactName:     "",
  mobile:          "",
  email:           "",
  gstNumber:       "",
  billingAddress:  "",
  shippingAddress: "",
  city:            "",
  state:           "",
  pincode:         "",
  paymentTerms:    PAYMENT_TERMS_OPTIONS[0],
  deliveryTerms:   DELIVERY_TERMS_OPTIONS[0],
  leadTime:        "",
  insurance:       "",
  validity:        VALIDITY_OPTIONS[0],
  remarks:         "",
  sealName:        "",
  signBy:          AUTHORIZED_SIGNATORY_DEFAULT,
  products: [
    { productName: "", quantity: 0, unit: "Kgs", rate: 0, gst: 0, hsn: "", packing: "" },
  ],
};

export default function Quotation() {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(false);
  const [password,      setPassword]      = useState("");
  const [authError,     setAuthError]     = useState(false);

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ name: "products", control });

  const [docType, setDocType]         = useState<DocType>("quotation");
  const [theme, setTheme]             = useState<"light" | "dark">("light");
  const [downloading, setDownloading] = useState(false);
  const [draftStatus, setDraftStatus] = useState<string>("");
  const previewRef = useRef<HTMLDivElement | null>(null);

  const formValues   = watch() as QuotationFormValues;
  const productItems = watch("products") as QuotationFormValues["products"];

  const totals = useMemo(() => {
    const subtotal = productItems.reduce(
      (s, i) => s + Number(i.quantity || 0) * Number(i.rate || 0), 0
    );
    const gst = productItems.reduce(
      (s, i) => s + Number(i.quantity || 0) * Number(i.rate || 0) * (Number(i.gst || 0) / 100), 0
    );
    return { subtotal, gst, grandTotal: subtotal + gst };
  }, [productItems]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("quotation-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!savedValue) {
      // no saved draft — generate a doc number if empty
      if (!getValues().quotationNo) setValue("quotationNo", generateDocNumber(docType === "proforma"));
      return;
    }
    try {
      const payload = JSON.parse(savedValue) as { values: QuotationFormValues; theme?: "light" | "dark" };
      if (payload?.values) reset(payload.values);
      if (payload?.theme) {
        setTheme(payload.theme);
        document.documentElement.classList.toggle("dark", payload.theme === "dark");
      }
      // enforce authorized signatory to the exact default
      setValue("signBy", AUTHORIZED_SIGNATORY_DEFAULT);
      // if quotation no is empty after loading, generate one matching the selected doc type
      if (!getValues().quotationNo) setValue("quotationNo", generateDocNumber(docType === "proforma"));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [reset]);

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
      <main className="flex min-h-screen items-center justify-center bg-[#f4f8ff] px-4 dark:bg-slate-950">
        <div className="w-full max-w-sm rounded-[28px] border border-slate-200 bg-white p-8 shadow-[var(--shadow-card)] dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex flex-col items-center gap-3">
            <img src={logo} alt="Laxmi Chemicals" className="h-14 w-20 object-contain" />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Restricted Access</h1>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Enter the password to access the quotation builder.
            </p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              autoFocus
              onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
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

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("quotation-theme", next);
  };

  const saveDraft = async () => {
    const valid = await trigger();
    if (!valid) { toast.error("Fix validation errors before saving draft."); return; }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ values: getValues(), theme }));
    setDraftStatus("Draft saved locally.");
    toast.success("Quotation draft saved.");
  };

  const loadDraft = () => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) { toast.error("No saved draft found."); return; }
    try {
      const payload = JSON.parse(saved) as { values: QuotationFormValues; theme?: "light" | "dark" };
      reset(payload.values);
      if (payload.theme) {
        setTheme(payload.theme);
        document.documentElement.classList.toggle("dark", payload.theme === "dark");
      }
      // always set authorized signatory to the required default
      setValue("signBy", AUTHORIZED_SIGNATORY_DEFAULT);
      // ensure doc number exists; if not, generate matching the current docType
      if (!getValues().quotationNo) setValue("quotationNo", generateDocNumber(docType === "proforma"));
      toast.success("Quotation draft loaded.");
    } catch {
      toast.error("Unable to load saved draft.");
    }
  };

  const clearDraft = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    reset(defaultValues);
    // ensure signatory remains the enforced default
    setValue("signBy", AUTHORIZED_SIGNATORY_DEFAULT);
    // generate a fresh doc number for the current doc type
    setValue("quotationNo", generateDocNumber(docType === "proforma"));
    setDraftStatus("Draft cleared.");
    toast.success("Draft cleared and reset to defaults.");
  };

  const handleDownloadPdf = async () => {
    const valid = await trigger();
    if (!valid) { toast.error("Please complete all required fields before export."); return; }
    const source = previewRef.current;
    if (!source) return;
    setDownloading(true);
    const docNo    = formValues.quotationNo?.trim();
    const buyer    = formValues.buyerName?.trim();
    const typeSuffix = docType === "proforma" ? "proforma_invoice" : "quotation";
    const parts    = [docNo, buyer].filter(Boolean);
    const filename = `${parts.length ? parts.join("_") : typeSuffix}_${typeSuffix}.pdf`.replace(/[^a-zA-Z0-9-_.]/g, "_");
    const imgs = Array.from(source.querySelectorAll("img"));
    await Promise.all(imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((res) => {
            img.addEventListener("load",  () => res(), { once: true });
            img.addEventListener("error", () => res(), { once: true });
          })
    ));
    try {
      await html2pdf()
        .from(source)
        .set({
          margin: 8,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          // @ts-ignore
          pagebreak: { mode: ["css", "legacy"] },
        })
        .save();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-3 py-14 text-slate-900 sm:px-4 sm:py-24 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">

        {/* ── Page header / actions ── */}
        <section className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-xl sm:rounded-[32px] sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:px-4 sm:py-2 sm:tracking-[0.3em]">
                Corporate Quotation Builder
              </span>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">Product Quotation</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Fill in buyer details and line items — company info is pre-loaded automatically.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button variant="default" size="sm" onClick={() => navigate("/letter-pad")} className="gap-1.5 text-xs sm:text-sm">
                <NotepadText className="h-4 w-4" />
                Letter Pad
              </Button>
              <Button variant="outline" size="sm" onClick={toggleTheme} className="text-xs sm:text-sm">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
              <Button variant="secondary" size="sm" onClick={saveDraft} className="text-xs sm:text-sm">Save Draft</Button>
              <Button variant="outline"   size="sm" onClick={loadDraft} className="text-xs sm:text-sm">Load Draft</Button>
              <Button variant="ghost"     size="sm" onClick={clearDraft} className="text-xs sm:text-sm">Reset</Button>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500 sm:mt-4 sm:text-sm">
            Draft status: <span className="font-medium text-slate-700 dark:text-slate-200">{draftStatus || "Unsaved changes"}</span>
          </p>
        </section>

        <div className="grid gap-6 sm:gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6 sm:space-y-8">

            {/* ── Company Info (read-only) ── */}
            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">Company Details</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Your Company</h2>
              <div className="mt-4 flex flex-wrap items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:gap-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-14 w-18 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-slate-800">
                  <img src={logo} alt="Laxmi Chemicals" className="h-14 w-20 object-contain" />
                </div>
                <div className="min-w-0 flex-1 text-sm text-slate-700 dark:text-slate-300 space-y-0.5">
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{COMPANY.name}</p>
                  <p className="break-words">{COMPANY.address}</p>
                  <p><span className="font-medium">GSTIN:</span> {COMPANY.gst}</p>
                  <p className="break-all"><span className="font-medium">Ph:</span> {COMPANY.phone} &nbsp;|&nbsp; <span className="font-medium">Email:</span> {COMPANY.email}</p>
                </div>
              </div>
            </section>

            {/* ── Quotation Reference + Buyer Info ── */}
            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">Document Type</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Select Document</h2>
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDocType("quotation");
                    if (!getValues().quotationNo) setValue("quotationNo", generateDocNumber(false));
                  }}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors sm:px-5 sm:py-2.5 ${
                    docType === "quotation"
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  Quotation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDocType("proforma");
                    if (!getValues().quotationNo) setValue("quotationNo", generateDocNumber(true));
                  }}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors sm:px-5 sm:py-2.5 ${
                    docType === "proforma"
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  Proforma Invoice
                </button>
              </div>

              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-500 sm:mt-8 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">
                {docType === "proforma" ? "Proforma Invoice Reference" : "Quotation Reference"}
              </p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                {docType === "proforma" ? "Proforma Invoice Details" : "Quotation Details"}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {docType === "proforma" ? "Proforma Invoice No." : "Quotation No."}
                  </label>
                  <Input
                    {...register("quotationNo")}
                    placeholder={docType === "proforma" ? PROFORMA_PLACEHOLDER : QUOTATION_PLACEHOLDER}
                  />
                  {errors.quotationNo && <p className="text-xs text-destructive">{errors.quotationNo.message}</p>}
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Date</label>
                  <Input {...register("quotationDate")} type="date" />
                  {errors.quotationDate && <p className="text-xs text-destructive">{errors.quotationDate.message}</p>}
                </div>
              </div>

              <div className="mt-8">
                <BuyerAutocomplete register={register} setValue={setValue} watch={watch} errors={errors} />
              </div>
            </section>

            {/* ── Line Items ── */}
            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">Product Quotation</p>
                  <h2 className="mt-1 text-xl font-semibold sm:mt-2 sm:text-2xl">Line Items</h2>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => append({ productName: "", quantity: 0, unit: "Kgs", rate: 0, gst: 0, hsn: "", packing: "" })}
                  className="shrink-0 text-xs sm:text-sm"
                >
                  + Add Product
                </Button>
              </div>

              <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 sm:mt-6 sm:rounded-3xl dark:divide-slate-800 dark:border-slate-800">
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-white px-3 py-4 sm:px-5 sm:py-5 dark:bg-slate-950">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                      <span className="shrink-0 text-xs font-semibold text-slate-400">#{index + 1}</span>
                      <select
                        {...register(`products.${index}.productName` as const, { required: true })}
                        className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 sm:px-3 sm:text-sm dark:bg-slate-800 dark:text-slate-100"
                      >
                        <option value="">Select product…</option>
                        {productCategories.map((cat) => (
                          <optgroup key={cat.title} label={cat.title}>
                            {cat.products.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="shrink-0 text-destructive hover:bg-destructive/10"
                      >
                        &times;
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-6">
                      <div className="grid min-w-0 gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Qty</label>
                        <Input {...register(`products.${index}.quantity` as const, { valueAsNumber: true })} type="number" min={0} step={0.01} placeholder="0" className="text-xs sm:text-sm" />
                      </div>
                      <div className="grid min-w-0 gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Unit</label>
                        <select
                          {...register(`products.${index}.unit` as const)}
                          className="min-w-0 rounded-md border border-input bg-background px-2 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 sm:px-3 sm:text-sm dark:bg-slate-800 dark:text-slate-100"
                        >
                          <option value="Kgs">Kgs</option>
                          <option value="Ltrs">Ltrs</option>
                          <option value="Pcs">Pcs</option>
                        </select>
                      </div>
                      <div className="grid min-w-0 gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Rate/Unit (₹)</label>
                        <Input {...register(`products.${index}.rate` as const, { valueAsNumber: true })} type="number" min={0} step={0.01} placeholder="0.00" className="text-xs sm:text-sm" />
                      </div>
                      <div className="grid min-w-0 gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">GST %</label>
                        <Input {...register(`products.${index}.gst` as const, { valueAsNumber: true })} type="number" min={0} step={0.1} placeholder="18" className="text-xs sm:text-sm" />
                      </div>
                      <div className="grid min-w-0 gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">HSN / SAC</label>
                        <Input {...register(`products.${index}.hsn` as const)} placeholder="2815" className="text-xs sm:text-sm" />
                      </div>
                      <div className="grid min-w-0 gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Packing</label>
                        <Input {...register(`products.${index}.packing` as const)} placeholder="25 Kg bag" className="text-xs sm:text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className="bg-white px-4 py-6 text-center text-sm text-slate-500 dark:bg-slate-950">
                    No products added yet. Tap "+ Add Product" to start.
                  </p>
                )}
                {errors.products?.message && (
                  <p className="bg-white px-4 py-3 text-sm font-medium text-destructive dark:bg-slate-950">{errors.products.message}</p>
                )}
              </div>
            </section>

            {/* ── Terms & Conditions ── */}
            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">Terms &amp; Conditions</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Quote Terms</h2>
              <div className="mt-6 grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Payment Terms</label>
                    <select
                      {...register("paymentTerms")}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {PAYMENT_TERMS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Delivery Terms</label>
                    <select
                      {...register("deliveryTerms")}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {DELIVERY_TERMS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Lead Time</label>
                    <Input {...register("leadTime")} placeholder="e.g. 7–10 business days" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Insurance</label>
                    <Input {...register("insurance")} placeholder="e.g. Insurance on buyer's request" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Validity</label>
                    <select
                      {...register("validity")}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {VALIDITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Remarks</label>
                    <Textarea {...register("remarks")} placeholder="Additional remarks (optional)" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Seal / Company Label</label>
                    <Input {...register("sealName")} placeholder="e.g. Laxmi Chemicals" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Authorized Signatory</label>
                    <Input
                      {...register("signBy")}
                      defaultValue={AUTHORIZED_SIGNATORY_DEFAULT}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Bank Details (read-only) ── */}
            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">Payment Information</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Bank Details</h2>
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="grid gap-1 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
                  <p><span className="font-medium text-slate-500">Bank:</span> {COMPANY.bank.name}</p>
                  <p><span className="font-medium text-slate-500">Account Name:</span> {COMPANY.bank.accountName}</p>
                  <p><span className="font-medium text-slate-500">Account No.:</span> {COMPANY.bank.accountNo}</p>
                  <p><span className="font-medium text-slate-500">IFSC Code:</span> {COMPANY.bank.ifsc}</p>
                  <p className="sm:col-span-2"><span className="font-medium text-slate-500">Branch:</span> {COMPANY.bank.branch}</p>
                </div>
              </div>
            </section>
          </div>

          {/* ── Sidebar: summary + export ── */}
          <aside className="space-y-5 sm:space-y-6">
            <section className="xl:sticky xl:top-24 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">
                {docType === "proforma" ? "Proforma Invoice Summary" : "Quotation Summary"}
              </p>
              <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:gap-4 dark:text-slate-300">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 sm:rounded-3xl sm:p-4 dark:bg-slate-950">
                  <span>Taxable Amount</span>
                  <span className="font-semibold">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 sm:rounded-3xl sm:p-4 dark:bg-slate-950">
                  <span>GST Amount</span>
                  <span className="font-semibold">₹{totals.gst.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-primary/5 p-3 text-base font-semibold text-slate-900 sm:rounded-3xl sm:p-4 dark:bg-primary/10 dark:text-slate-100">
                  <span>Grand Total</span>
                  <span>₹{totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:mt-6">
                <Button variant="secondary" onClick={handleDownloadPdf} disabled={downloading} className="text-xs sm:text-sm">
                  {downloading
                    ? "Generating PDF…"
                    : docType === "proforma"
                    ? "Download Proforma PDF"
                    : "Download Quotation PDF"}
                </Button>
                <Button variant="outline" onClick={() => window.print()} className="text-xs sm:text-sm">
                  Print Friendly View
                </Button>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold sm:text-xl">Live Preview</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                The preview below updates as you fill the form. PDF export matches this layout exactly.
              </p>
            </section>
          </aside>
        </div>

        {/* ── Full-width quotation preview ── */}
        <section className="overflow-x-auto rounded-[24px] border border-slate-200 bg-white p-2 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-4 dark:border-slate-800 dark:bg-slate-900">
          <div ref={previewRef}>
            <QuotationPreview
              docType={docType}
              companyLogoUrl={logo}
              companyName={COMPANY.name}
              companyAddress={COMPANY.address}
              companyGst={COMPANY.gst}
              companyPhone={COMPANY.phone}
              companyEmail={COMPANY.email}
              quotationNo={formValues.quotationNo}
              quotationDate={formValues.quotationDate}
              buyerName={formValues.buyerName}
              contactName={formValues.contactName}
              mobile={formValues.mobile}
              email={formValues.email}
              gstNumber={formValues.gstNumber}
              billingAddress={formValues.billingAddress}
              shippingAddress={formValues.shippingAddress}
              city={formValues.city}
              state={formValues.state}
              pincode={formValues.pincode}
              products={formValues.products as QuotationProductItem[]}
              paymentTerms={formValues.paymentTerms}
              deliveryTerms={formValues.deliveryTerms}
              leadTime={formValues.leadTime}
              insurance={formValues.insurance}
              validity={formValues.validity}
              remarks={formValues.remarks ?? ""}
              sealName={formValues.sealName}
              signBy={formValues.signBy}
              bankName={COMPANY.bank.name}
              bankAccountName={COMPANY.bank.accountName}
              bankAccountNo={COMPANY.bank.accountNo}
              bankIfsc={COMPANY.bank.ifsc}
              bankBranch={COMPANY.bank.branch}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
