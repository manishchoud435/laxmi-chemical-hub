import { type CSSProperties } from "react";

export interface QuotationProductItem {
  productName: string;
  quantity: number;
  unit: string;
  rate: number;
  gst: number;
  hsn: string;
  packing: string;
}

export type DocType = "quotation" | "proforma";

export interface QuotationPreviewProps {
  docType?: DocType;
  companyLogoUrl?: string;
  companyName: string;
  companyAddress: string;
  companyGst: string;
  companyPhone: string;
  companyEmail: string;
  quotationNo: string;
  quotationDate: string;
  buyerName: string;
  contactName: string;
  mobile: string;
  email: string;
  gstNumber: string;
  billingAddress: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  products: QuotationProductItem[];
  paymentTerms: string;
  deliveryTerms: string;
  leadTime: string;
  insurance: string;
  validity: string;
  remarks: string;
  sealName: string;
  signBy: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  bankBranch?: string;
}

// ── Dropdown option constants (exported for use elsewhere) ─────
export const PAYMENT_TERMS_OPTIONS = [
  "Advance payment",
  "15 Days from invoice date",
  "30 Days from invoice date",
  "45 Days from invoice date",
  "60 Days from invoice date",
  "Deliver against payment",
  "Deliver against advance payment",
];

export const DELIVERY_TERMS_OPTIONS = [
  "Deliver within 1 day",
  "Deliver within 2 days",
  "Deliver within 3 days",
  "Deliver within 4 days",
  "Deliver within 5 days",
];

export const VALIDITY_OPTIONS = ["2 Days", "0 Days", "1 Day", "3 Days", "4 Days", "5 Days", "6 Days"];

export const AUTHORIZED_SIGNATORY_DEFAULT = "Omaram";

export const QUOTATION_PLACEHOLDER = "LXM/2026-27/123";
export const PROFORMA_PLACEHOLDER = "LXM/PI/2026-27/123";

// ── Amount in words (Indian numbering) ──────────────────────────
const _ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
  "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
  "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const _tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
  "Sixty", "Seventy", "Eighty", "Ninety"];

function convertHundreds(n: number): string {
  if (n === 0) return "";
  if (n < 20) return _ones[n];
  if (n < 100) return _tens[Math.floor(n / 10)] + (n % 10 ? " " + _ones[n % 10] : "");
  return _ones[Math.floor(n / 100)] + " Hundred" +
    (n % 100 !== 0 ? " " + convertHundreds(n % 100) : "");
}

function toIndianWords(n: number): string {
  if (n === 0) return "Zero";
  const crore    = Math.floor(n / 10_000_000);
  const lakh     = Math.floor((n % 10_000_000) / 100_000);
  const thousand = Math.floor((n % 100_000) / 1_000);
  const rest     = n % 1_000;
  let out = "";
  if (crore)    out += convertHundreds(crore)    + " Crore ";
  if (lakh)     out += convertHundreds(lakh)     + " Lakh ";
  if (thousand) out += convertHundreds(thousand) + " Thousand ";
  if (rest)     out += convertHundreds(rest);
  return out.trim();
}

function amountInWords(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "Zero Rupees Only";
  const rupees = Math.floor(amount);
  const paise  = Math.round((amount - rupees) * 100);
  let result   = toIndianWords(rupees) + " Rupees";
  if (paise > 0) result += " and " + toIndianWords(paise) + " Paise";
  return result + " Only";
}

// ── Currency helper ──────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2,
  }).format(Number.isFinite(v) ? v : 0);

const avoidBreak: CSSProperties = { pageBreakInside: "avoid" };

// ── Reusable label/value pair inside Bill-To / Ship-To ──────────
function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <p className="text-sm text-slate-700">
      <span className="font-medium text-slate-500">{label}: </span>{value}
    </p>
  );
}

// ────────────────────────────────────────────────────────────────
export const QuotationPreview = ({
  docType = "quotation",
  companyLogoUrl,
  companyName,
  companyAddress,
  companyGst,
  companyPhone,
  companyEmail,
  quotationNo,
  quotationDate,
  buyerName,
  contactName,
  mobile,
  email,
  gstNumber,
  billingAddress,
  shippingAddress,
  city,
  state,
  pincode,
  products,
  paymentTerms,
  deliveryTerms,
  leadTime,
  insurance,
  validity,
  remarks,
  sealName,
  signBy,
  bankName,
  bankAccountName,
  bankAccountNo,
  bankIfsc,
  bankBranch,
}: QuotationPreviewProps) => {
  const isProforma = docType === "proforma";
  const docNoLabel = isProforma ? "Proforma Invoice No." : "Quotation No.";

  // Use provided values or fall back to the exact default strings exported above
  const displayQuotationNo = quotationNo || (isProforma ? PROFORMA_PLACEHOLDER : QUOTATION_PLACEHOLDER);
  const paymentTermsValue = paymentTerms ?? PAYMENT_TERMS_OPTIONS[0];
  const deliveryTermsValue = deliveryTerms ?? DELIVERY_TERMS_OPTIONS[0];
  const validityValue = validity ?? VALIDITY_OPTIONS[0];
  const signByValue = signBy ?? AUTHORIZED_SIGNATORY_DEFAULT;

  const subtotal   = products.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.rate || 0), 0);
  const totalGst   = products.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.rate || 0) * (Number(i.gst || 0) / 100), 0);
  const grandTotal = subtotal + totalGst;

  return (
    <article
      className="quotation-preview w-full overflow-hidden bg-white text-slate-900 print:shadow-none"
      style={{ fontFamily: "Arial, Helvetica, sans-serif", borderTop: "4px solid #2563eb" }}
    >
      {/* ── LETTERHEAD ─────────────────────────────────────────── */}
      <header className="border-b border-slate-200 px-8 py-5">
        <div className="grid grid-cols-2 items-start gap-4">
          {/* Left: logo + company info */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden">
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt="logo" className="h-full w-full object-contain" />
              ) : (
                <span className="text-2xl font-bold text-primary">L</span>
              )}
            </div>
            <div className="border-l border-slate-200 pl-4">
              <h1 className="text-base font-bold leading-snug tracking-wide text-slate-900 whitespace-nowrap">
                {companyName || "—"}
              </h1>
              <p className="mt-0.5 text-[11px] leading-[1.5] text-slate-500">{companyAddress || "—"}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">GSTIN:</span> {companyGst || "N/A"}
              </p>
              <p className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Ph:</span> {companyPhone || "—"}
                {companyEmail && (
                  <> &nbsp;|&nbsp; <span className="font-semibold text-slate-600">Email:</span> {companyEmail}</>
                )}
              </p>
            </div>
          </div>

          {/* Right: document title + reference */}
          <div className="flex flex-col items-end text-right">
            {isProforma ? (
              <p className="text-[18px] font-extrabold tracking-[0.12em] text-primary whitespace-nowrap">PROFORMA INVOICE</p>
            ) : (
              <p className="text-[28px] font-extrabold tracking-[0.16em] text-primary">QUOTATION</p>
            )}
            <div className="mt-2 space-y-0.5 text-[11px] text-slate-500">
              <p><span className="font-semibold text-slate-600">{docNoLabel}:</span> {displayQuotationNo}</p>
              <p><span className="font-semibold text-slate-600">Date:</span> {quotationDate || "—"}</p>
              <p><span className="font-semibold text-slate-600">Valid Until:</span> {validityValue}</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── BILL TO / SHIP TO ──────────────────────────────────── */}
      <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
        <div className="border-r border-slate-200 px-8 py-5">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">Bill To</p>
          <p className="text-sm font-bold text-slate-900">{buyerName || "—"}</p>
          <div className="mt-1 space-y-0.5">
            <InfoRow label="Contact" value={contactName} />
            <InfoRow label="Mobile"  value={mobile} />
            <InfoRow label="Email"   value={email} />
            <InfoRow label="GSTIN"   value={gstNumber} />
            {billingAddress && <p className="text-sm text-slate-600">{billingAddress}</p>}
            {(city || state || pincode) && (
              <p className="text-sm text-slate-600">{[city, state, pincode].filter(Boolean).join(", ")}</p>
            )}
          </div>
        </div>
        <div className="px-8 py-5">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">Ship To</p>
          <p className="text-sm font-bold text-slate-900">{buyerName || "—"}</p>
          <div className="mt-1 space-y-0.5">
            <p className="text-sm text-slate-600">{shippingAddress || billingAddress || "Same as billing address"}</p>
            {(city || state || pincode) && (
              <p className="text-sm text-slate-600">{[city, state, pincode].filter(Boolean).join(", ")}</p>
            )}
            {gstNumber && <p className="text-xs text-slate-500">GSTIN: {gstNumber}</p>}
          </div>
        </div>
      </div>

      {/* ── PRODUCT TABLE ──────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="border-b border-slate-700 px-2 py-3 text-center font-semibold">Sr.</th>
              <th className="border-b border-slate-700 px-3 py-3 text-left font-semibold">Product Description</th>
              <th className="border-b border-slate-700 px-2 py-3 text-center font-semibold">HSN / SAC</th>
              <th className="border-b border-slate-700 px-2 py-3 text-right font-semibold">Qty</th>
              <th className="border-b border-slate-700 px-2 py-3 text-center font-semibold">Unit</th>
              <th className="border-b border-slate-700 px-2 py-3 text-right font-semibold">Rate (₹)</th>
              <th className="border-b border-slate-700 px-2 py-3 text-right font-semibold">Taxable Amt (₹)</th>
              <th className="border-b border-slate-700 px-2 py-3 text-center font-semibold">GST %</th>
              <th className="border-b border-slate-700 px-2 py-3 text-right font-semibold">GST Amt (₹)</th>
              <th className="border-b border-slate-700 px-2 py-3 text-right font-semibold">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={10} className="border border-slate-200 px-3 py-8 text-center text-sm text-slate-400">
                  Add at least one product to render the quotation.
                </td>
              </tr>
            ) : (
              products.map((item, idx) => {
                const taxable = Number(item.quantity || 0) * Number(item.rate || 0);
                const gstAmt  = taxable * (Number(item.gst || 0) / 100);
                const total   = taxable + gstAmt;
                return (
                  <tr
                    key={`${item.productName}-${idx}`}
                    style={avoidBreak}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="border-b border-slate-100 px-2 py-3 text-center text-slate-500">{idx + 1}</td>
                    <td className="border-b border-slate-100 px-3 py-3">
                      <span className="font-medium text-slate-900">{item.productName || "—"}</span>
                      {item.packing && (
                        <span className="mt-0.5 block text-[10px] text-slate-400">Packing: {item.packing}</span>
                      )}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-3 text-center text-slate-500">{item.hsn || "—"}</td>
                    <td className="border-b border-slate-100 px-2 py-3 text-right text-slate-600">{Number(item.quantity || 0).toLocaleString("en-IN")}</td>
                    <td className="border-b border-slate-100 px-2 py-3 text-center text-slate-500">{item.unit || "Kgs"}</td>
                    <td className="border-b border-slate-100 px-2 py-3 text-right text-slate-600">{fmt(Number(item.rate || 0))}</td>
                    <td className="border-b border-slate-100 px-2 py-3 text-right text-slate-600">{fmt(taxable)}</td>
                    <td className="border-b border-slate-100 px-2 py-3 text-center text-slate-500">{Number(item.gst || 0)}%</td>
                    <td className="border-b border-slate-100 px-2 py-3 text-right text-slate-600">{fmt(gstAmt)}</td>
                    <td className="border-b border-slate-100 px-2 py-3 text-right font-semibold text-slate-900">{fmt(total)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── TOTALS ─────────────────────────────────────────────── */}
      <div className="flex justify-end border-b border-slate-200 px-8 py-5">
        <table className="min-w-[300px] text-sm">
          <tbody>
            <tr>
              <td className="py-1 pr-10 text-slate-500">Taxable Amount (before GST)</td>
              <td className="py-1 text-right font-medium text-slate-700">{fmt(subtotal)}</td>
            </tr>
            <tr>
              <td className="py-1 pr-10 text-slate-500">Total GST</td>
              <td className="py-1 text-right font-medium text-slate-700">{fmt(totalGst)}</td>
            </tr>
            <tr>
              <td colSpan={2}><div className="my-2 border-t border-slate-300" /></td>
            </tr>
            <tr>
              <td className="pr-10 text-base font-bold text-slate-900">Grand Total</td>
              <td className="text-right text-base font-bold text-slate-900">{fmt(grandTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── AMOUNT IN WORDS ────────────────────────────────────── */}
      <div className="border-b border-slate-200 px-8 py-3">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Amount in Words: </span>
        <span className="text-xs italic text-slate-600">{amountInWords(grandTotal)}</span>
      </div>

      {/* ── BANK DETAILS ───────────────────────────────────────── */}
      {(bankName || bankAccountNo || bankIfsc) && (
        <div className="border-b border-slate-200 px-8 py-5">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">Bank Details for Payment</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm sm:grid-cols-3">
            {bankName        && <p><span className="font-semibold text-slate-600">Bank: </span><span className="text-slate-500">{bankName}</span></p>}
            {bankAccountName && <p><span className="font-semibold text-slate-600">Account Name: </span><span className="text-slate-500">{bankAccountName}</span></p>}
            {bankAccountNo   && <p><span className="font-semibold text-slate-600">Account No.: </span><span className="text-slate-500">{bankAccountNo}</span></p>}
            {bankIfsc        && <p><span className="font-semibold text-slate-600">IFSC Code: </span><span className="text-slate-500">{bankIfsc}</span></p>}
            {bankBranch      && <p><span className="font-semibold text-slate-600">Branch: </span><span className="text-slate-500">{bankBranch}</span></p>}
          </div>
        </div>
      )}

      {/* ── TERMS & SIGNATURE ──────────────────────────────────── */}
      <div className="grid grid-cols-[1.35fr_0.65fr] border-b border-slate-200">
        <div className="border-r border-slate-200 px-8 py-6">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">Terms &amp; Conditions</p>
          <div className="space-y-1.5 text-sm text-slate-600">
            {paymentTermsValue  && <p><span className="font-semibold text-slate-700">Payment Terms: </span>{paymentTermsValue}</p>}
            {deliveryTermsValue && <p><span className="font-semibold text-slate-700">Delivery Terms: </span>{deliveryTermsValue}</p>}
            {leadTime      && <p><span className="font-semibold text-slate-700">Lead Time: </span>{leadTime}</p>}
            {insurance     && <p><span className="font-semibold text-slate-700">Insurance: </span>{insurance}</p>}
            {remarks       && <p><span className="font-semibold text-slate-700">Remarks: </span>{remarks}</p>}
            {!paymentTerms && !deliveryTerms && !leadTime && !insurance && !remarks && (
              <p className="text-slate-400">No terms specified.</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center px-8 py-6 text-center">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">For {sealName || companyName}</p>
          <div className="mt-auto w-full border-t border-slate-300 pt-3">
            <p className="text-sm font-semibold text-slate-900">{signByValue}</p>
            <p className="text-xs text-slate-400">Authorized Signatory</p>
          </div>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="flex items-center justify-between px-8 py-3 text-[10px] text-slate-400">
        <span>This is a computer-generated {isProforma ? "proforma invoice" : "quotation"}. No physical signature required.</span>
        <span>Page 1 of 1</span>
      </footer>
    </article>
  );
};
