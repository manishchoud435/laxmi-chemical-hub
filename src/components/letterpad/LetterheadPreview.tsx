import { MapPin, Phone, Mail, ReceiptText } from "lucide-react";

export interface LetterheadPreviewProps {
  companyLogoUrl?: string;
  companyName: string;
  companyAddress: string;
  companyGst: string;
  companyPhone: string;
  companyEmail: string;
  tagline?: string;
  since?: string;
  body?: string;
}

const ACCENT = "#2563eb";

// A blank company letterhead ("letter pad") rendered at A4 proportions
// (794 x 1123 px ≈ 210 x 297 mm at 96dpi). Header + footer are filled from
// company data; the middle is intentionally left blank to write on / print.
export const LetterheadPreview = ({
  companyLogoUrl,
  companyName,
  companyAddress,
  companyGst,
  companyPhone,
  companyEmail,
  tagline,
  since,
  body,
}: LetterheadPreviewProps) => {
  // Break the address so the city + pincode stay together on the last line
  // instead of orphaning the pincode (e.g. "…Mysore -" / "570016").
  const addrParts = companyAddress.split(",").map((s) => s.trim()).filter(Boolean);
  const addrLine1 = addrParts.length > 1 ? addrParts.slice(0, -1).join(", ") : companyAddress;
  const addrLine2 = addrParts.length > 1 ? addrParts[addrParts.length - 1] : "";

  return (
    <div
      className="letterhead-preview relative mx-auto flex flex-col overflow-hidden bg-white text-slate-900"
      style={{
        width: "794px",
        // A4 is 1123px tall at 96dpi; stay just under so the PDF fits one page
        minHeight: "1100px",
        fontFamily: "Arial, Helvetica, sans-serif",
        borderTop: `6px solid ${ACCENT}`,
      }}
    >
      {/* ── BACKGROUND WATERMARK (faint logo) ──────────────────── */}
      {companyLogoUrl && (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <img
            src={companyLogoUrl}
            alt=""
            aria-hidden
            className="w-[65%] max-w-[520px] object-contain"
            style={{ opacity: 0.06 }}
          />
        </div>
      )}

      {/* ── CONTENT (above the watermark) ──────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col">
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header style={{ padding: "36px 56px 0" }}>
        <div className="flex items-start justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden">
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt="logo" className="h-full w-full object-contain" />
              ) : (
                <span className="text-3xl font-bold" style={{ color: ACCENT }}>L</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide text-slate-900">{companyName}</h1>
              {tagline && (
                <p className="mt-0.5 text-sm font-semibold" style={{ color: ACCENT }}>{tagline}</p>
              )}
              {since && (
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
                  Since {since}
                </p>
              )}
            </div>
          </div>
          <div className="max-w-[280px] space-y-1 text-[11px] leading-[1.7] text-slate-500">
            <p className="flex items-start justify-end gap-1.5">
              <MapPin className="mt-[3px] h-3 w-3 shrink-0 text-slate-400" />
              <span className="text-right">
                {addrLine1}
                {addrLine2 && (
                  <>
                    <br />
                    {addrLine2}
                  </>
                )}
              </span>
            </p>
            <p className="flex items-center justify-end gap-1.5">
              <ReceiptText className="h-3 w-3 shrink-0 text-slate-400" />
              <span><span className="font-semibold text-slate-600">GSTIN:</span> {companyGst}</span>
            </p>
            <p className="flex items-center justify-end gap-1.5">
              <Phone className="h-3 w-3 shrink-0 text-slate-400" />
              <span>{companyPhone}</span>
            </p>
            <p className="flex items-center justify-end gap-1.5">
              <Mail className="h-3 w-3 shrink-0 text-slate-400" />
              <span>{companyEmail}</span>
            </p>
          </div>
        </div>
        <div className="mt-5 h-[3px] w-full rounded-full" style={{ background: ACCENT }} />
      </header>

      {/* ── BODY (letter content) ──────────────────────────────── */}
      <div className="flex-1" style={{ padding: "28px 56px" }}>
        {body ? (
          <div className="text-[13px] leading-[1.9] text-slate-800">
            {body.split("\n").map((line, i) => (
              // one element per line so PDF page breaks fall between lines
              <p
                key={`line-${i}`}
                className="whitespace-pre-wrap"
                style={{ margin: 0, pageBreakInside: "avoid" }}
              >
                {line === "" ? " " : line}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="lh-placeholder select-none text-sm italic text-slate-300 print:hidden">
              Type or paste your letter content in the editor — it will appear here.
            </span>
          </div>
        )}
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ padding: "0 56px 32px" }}>
        <div className="mb-3 h-px w-full bg-slate-200" />
        <p className="text-center text-[10px] leading-[1.7] text-slate-400">
          {companyAddress} &nbsp;•&nbsp; Ph: {companyPhone} &nbsp;•&nbsp; {companyEmail} &nbsp;•&nbsp; GSTIN: {companyGst}
        </p>
      </footer>
      </div>
    </div>
  );
};
