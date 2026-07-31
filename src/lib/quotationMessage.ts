import { COMPANY } from "@/data/company";
import type { ShareChannel } from "@/lib/shareDocument";

/** ₹1,23,456.00 — Indian digit grouping. */
export const inr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

/** 2026-07-31 → 31 Jul 2026 */
export const formatDocDate = (iso?: string) => {
  if (!iso) return "";
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export interface QuotationMessageItem {
  productName?: string;
  quantity?: number;
  unit?: string;
  rate?: number;
}

export interface QuotationMessageInput {
  isProforma: boolean;
  docNo?: string;
  /** ISO date from the form, e.g. 2026-07-31. */
  docDate?: string;
  buyerName?: string;
  contactName?: string;
  signBy?: string;
  remarks?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  leadTime?: string;
  validity?: string;
  items: QuotationMessageItem[];
  totals: { subtotal: number; gst: number; grandTotal: number };
}

const clean = (value?: string) => value?.trim() || "";

const docLabelOf = (isProforma: boolean) =>
  isProforma ? "Proforma Invoice" : "Quotation";

/** Email subject line, e.g. `Quotation LXM/2026-27/007 — ACME Ltd | LAXMI CHEMICALS`. */
export function quotationSubject(input: QuotationMessageInput): string {
  const buyer = clean(input.buyerName);
  return [
    [docLabelOf(input.isProforma), clean(input.docNo)].filter(Boolean).join(" "),
    buyer ? `— ${buyer}` : "",
    `| ${COMPANY.name}`,
  ]
    .filter(Boolean)
    .join(" ");
}

function lineItems(items: QuotationMessageItem[]): string[] {
  return items
    .filter((item) => clean(item.productName))
    .map((item, idx) => {
      const qty = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      const unit = clean(item.unit);
      const qtyPart = qty ? `${qty}${unit ? ` ${unit}` : ""}` : "";
      const ratePart = rate ? `@ ${inr(rate)}${unit ? `/${unit}` : ""}` : "";
      // "200 Ltr @ ₹185.00/Ltr" — one dash separates the product from its terms.
      const qtyAndRate = [qtyPart, ratePart].filter(Boolean).join(" ");
      return `${idx + 1}. ${[clean(item.productName), qtyAndRate]
        .filter(Boolean)
        .join(" — ")}`;
    });
}

/**
 * Formal covering note that accompanies the shared PDF. Both channels get the
 * same official wording; the only difference is the sign-off. Email leaves it
 * out because the mail client already appends the company signature, and
 * repeating it would print the address and GSTIN twice. WhatsApp has no
 * signature, so it carries one.
 *
 * Built from the live form values, so the message always matches the
 * attachment.
 */
export function quotationShareMessage(
  channel: ShareChannel,
  input: QuotationMessageInput
): string {
  const label = docLabelOf(input.isProforma);
  const docNo = clean(input.docNo);
  const dated = formatDocDate(input.docDate);
  const greeting =
    clean(input.contactName) || clean(input.buyerName) || "Sir/Madam";
  const signer = clean(input.signBy);
  const remarks = clean(input.remarks);

  const reference = `${[label, docNo].filter(Boolean).join(" ")}${
    dated ? ` dated ${dated}` : ""
  }`;

  const items = lineItems(input.items);
  const paymentTerms = clean(input.paymentTerms);
  const deliveryTerms = clean(input.deliveryTerms);
  const leadTime = clean(input.leadTime);
  const validity = clean(input.validity);
  // Rates are often left blank on an enquiry-stage draft — quoting ₹0.00 back
  // to a customer looks broken, so the value block is dropped entirely.
  const isPriced = input.totals.grandTotal > 0;

  const terms = [
    paymentTerms && `Payment terms  : ${paymentTerms}`,
    deliveryTerms && `Delivery terms : ${deliveryTerms}`,
    leadTime && `Lead time      : ${leadTime}`,
    validity && `Validity       : ${validity}`,
  ].filter(Boolean) as string[];

  return [
    `Dear ${greeting},`,
    "",
    `Greetings from ${COMPANY.name}.`,
    "",
    `Thank you for your enquiry. Please find attached our ${reference} for your kind perusal.`,
    ...(items.length ? ["", "Summary of the offer:", ...items] : []),
    ...(isPriced
      ? [
          "",
          `Taxable value  : ${inr(input.totals.subtotal)}`,
          `GST            : ${inr(input.totals.gst)}`,
          `Total value    : ${inr(input.totals.grandTotal)}`,
        ]
      : []),
    ...(terms.length ? ["", ...terms] : []),
    ...(remarks ? ["", `Remarks: ${remarks}`] : []),
    "",
    "We trust the above is in line with your requirement. Should you need any clarification or a revision, kindly let us know.",
    "",
    "We look forward to your valued order.",
    ...(channel === "whatsapp"
      ? [
          "",
          "Thanks & regards,",
          ...(signer ? [signer] : []),
          COMPANY.name,
          COMPANY.phone,
        ]
      : []),
  ].join("\n");
}
