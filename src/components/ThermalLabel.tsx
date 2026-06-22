import React from "react";
import { COMPANY } from "@/data/company";
import type { ProductSafety } from "@/data/productSafety";
import laxmiLogo from "@/assets/laxmi-chemicals-logo1.png";

export interface ThermalLabelProps {
  productName: string;
  invoice?: string;
  batchNo?: string;
  mfgDate?: string;
  expDate?: string;
  make?: string;
  netQty?: string;
  tareQty?: string;
  grossQty?: string;
  safety?: ProductSafety;
  size?: "3x5" | "4x4" | "4x6" | "6x4" | "5x3";
  /**
   * Rotate the content 90° so it prints correctly when the label is applied
   * (stuck) sideways on the drum. Left undefined it auto-detects: portrait
   * media (3×5, 4×6) is rotated, landscape media (6×4) is left as-is.
   */
  rotate?: boolean;
}

const containerSizes: Record<string, { width: string; height: string }> = {
  "3x5": { width: "3in", height: "5in" },
  "4x4": { width: "4in", height: "4in" },
  "4x6": { width: "4in", height: "6in" },
  "6x4": { width: "6in", height: "4in" },
  "5x3": { width: "5in", height: "3in" },
};

const BRAND = "#C8102E";
const RED_TINT = "#FBE9EC";

/* ── GHS pictograms (red diamond / triangle) ─────────── */

const GhsFlame = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <polygon points="50,4 96,50 50,96 4,50" fill="#FFF" stroke={BRAND} strokeWidth="7" strokeLinejoin="round" />
    <path
      d="M50 18 C 45 32, 37 40, 37 58 C 37 67, 43 73, 49 74 C 46 69, 48 63, 52 60 C 55 64, 54 69, 56 74 C 62 72, 65 66, 64 58 C 64 48, 59 44, 57 36 C 55 44, 52 42, 50 18 Z"
      fill="#000"
    />
    <rect x="38" y="74" width="24" height="4" rx="1.5" fill="#000" />
  </svg>
);

const GhsExclamation = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M50 8 L91 80 Q94 86, 88 86 L12 86 Q6 86, 9 80 Z" fill="#FFF" stroke={BRAND} strokeWidth="7" strokeLinejoin="round" />
    <rect x="46" y="32" width="8" height="32" rx="2" fill="#000" />
    <circle cx="50" cy="75" r="4.5" fill="#000" />
  </svg>
);

/* ── Contact icons (brand colour) ───────────────────── */

const WhatsAppIcon = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ flex: "0 0 auto", verticalAlign: "-2px" }}>
    <path
      d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
      fill="#25D366"
    />
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      fill="#fff"
    />
  </svg>
);

const GmailIcon = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} style={{ flex: "0 0 auto", verticalAlign: "-2px" }}>
    <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z" />
    <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z" />
    <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
    <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z" />
    <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0C43.076,8,45,9.924,45,12.298z" />
  </svg>
);

/* ── Data table (two label|value pairs per row) ──────── */

const labelTd: React.CSSProperties = {
  border: `1px solid ${BRAND}`,
  padding: "4px 8px",
  fontSize: 10.5,
  fontWeight: 800,
  letterSpacing: 0.3,
  color: BRAND,
  background: RED_TINT,
  verticalAlign: "top",
  lineHeight: 1.3,
};

const valueTd: React.CSSProperties = {
  border: `1px solid ${BRAND}`,
  padding: "4px 8px",
  fontSize: 11,
  fontWeight: 600,
  color: "#000",
  verticalAlign: "top",
  lineHeight: 1.3,
  wordBreak: "break-word",
};

const DataTable = ({
  pairs,
  make,
}: {
  pairs: [string, string][][];
  make?: string;
}) => (
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
      borderBottom: `2.5px solid ${BRAND}`,
    }}
  >
    <colgroup>
      <col style={{ width: "16%" }} />
      <col style={{ width: "34%" }} />
      <col style={{ width: "16%" }} />
      <col style={{ width: "34%" }} />
    </colgroup>
    <tbody>
      {pairs.map((row, ri) => (
        <tr key={ri}>
          {row.map(([label, value]) => (
            <React.Fragment key={label}>
              <td style={labelTd}>{label}</td>
              <td style={valueTd}>{value}</td>
            </React.Fragment>
          ))}
          {row.length === 1 && (
            <>
              <td style={labelTd} />
              <td style={valueTd} />
            </>
          )}
        </tr>
      ))}
      {make && (
        <tr>
          <td style={labelTd}>MAKE</td>
          <td style={valueTd} colSpan={3}>
            {make}
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

const ThermalLabel = ({
  productName,
  invoice,
  batchNo,
  mfgDate,
  expDate,
  make,
  netQty,
  tareQty,
  grossQty,
  safety,
  size = "4x6",
  rotate,
}: ThermalLabelProps) => {
  const dims = containerSizes[size] || containerSizes["4x6"];

  // Portrait media (3×5, 4×6) turns the landscape artwork 90° to fit;
  // landscape media (6×4) already matches, so it stays put.
  const isPortrait = parseFloat(dims.height) > parseFloat(dims.width);
  const doRotate = rotate ?? isPortrait;

  // The content is always laid out in the wide (landscape) orientation; when
  // rotating, an outer wrapper turns it 90°. The wrapper carries the transform
  // so `.thermal-label__content` stays transform-free for a clean export.
  const wrapperStyle: React.CSSProperties = doRotate
    ? {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: dims.height,
        height: dims.width,
        transform: "translate(-50%, -50%) rotate(90deg)",
      }
    : { width: "100%", height: "100%" };

  const present = (
    [
      ["INVOICE", invoice],
      ["BATCH NO", batchNo],
      ["MFG DATE", mfgDate],
      ["EXP DATE", expDate],
      ["NET QTY", netQty],
      ["TARE QTY", tareQty],
      ["GROSS QTY", grossQty],
    ] as [string, string | undefined][]
  ).filter((r): r is [string, string] => Boolean(r[1]));

  const pairs: [string, string][][] = [];
  for (let i = 0; i < present.length; i += 2) pairs.push(present.slice(i, i + 2));

  const precautions = (safety?.precautionary || []).slice(0, 4).join("  •  ");

  return (
    <div
      className="thermal-label"
      style={{
        width: dims.width,
        height: dims.height,
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        boxSizing: "border-box",
      }}
    >
      <div style={wrapperStyle}>
        <div
          className="thermal-label__content"
          style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            padding: 6,
            fontFamily: "Arial, Helvetica, sans-serif",
            background: "#fff",
            color: "#000",
          }}
        >
          {/* Framed label */}
          <div
            style={{
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              border: `2.5px solid ${BRAND}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* ── Header ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 8px",
                borderBottom: `2.5px solid ${BRAND}`,
              }}
            >
              <img
                src={laxmiLogo}
                alt="Laxmi Chemicals"
                style={{ height: 38, width: "auto", objectFit: "contain" }}
              />
              <div style={{ flex: 1, lineHeight: 1.15, minWidth: 0 }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: "#555" }}>
                  MARKETED BY
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: 0.4, color: BRAND }}>
                  {COMPANY.name}
                </div>
                <div style={{ fontSize: 8.5, fontWeight: 600, color: "#333" }}>{COMPANY.tagline}</div>
                <div style={{ fontSize: 8.5, fontWeight: 700, marginTop: 1, color: "#000" }}>
                  GSTIN: {COMPANY.gst}
                </div>
              </div>
            </div>

            {/* ── Product name banner ── */}
            <div
              style={{
                background: BRAND,
                color: "#fff",
                textAlign: "center",
                padding: "8px",
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: 1,
                textTransform: "uppercase",
                wordBreak: "break-word",
                lineHeight: 1.1,
              }}
            >
              {productName}
            </div>

            {/* ── Data table ── */}
            {(pairs.length > 0 || make) && <DataTable pairs={pairs} make={make} />}

            {/* ── Hazard & safety (fills remaining space) ── */}
            {safety && (
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  gap: 10,
                  padding: "7px 10px",
                }}
              >
                {/* Pictograms + signal word */}
                <div
                  style={{
                    flex: "0 0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", gap: 5 }}>
                    <div style={{ width: 40, height: 40 }}>
                      <GhsExclamation />
                    </div>
                    <div style={{ width: 40, height: 40 }}>
                      <GhsFlame />
                    </div>
                  </div>
                  <div
                    style={{
                      border: `2px solid ${BRAND}`,
                      color: BRAND,
                      padding: "2px 14px",
                      fontWeight: 900,
                      fontSize: 15,
                      letterSpacing: 2.5,
                    }}
                  >
                    DANGER
                  </div>
                </div>

                {/* Safety text */}
                <div style={{ flex: 1, fontSize: 9, lineHeight: 1.32, overflow: "hidden", minWidth: 0 }}>
                  {safety.hazardous && (
                    <div>
                      <span style={{ fontWeight: 800, color: BRAND }}>Hazard: </span>
                      {safety.hazardous}
                    </div>
                  )}
                  {precautions && (
                    <div style={{ marginTop: 2 }}>
                      <span style={{ fontWeight: 800, color: BRAND }}>Precautions: </span>
                      {precautions}
                    </div>
                  )}
                  {safety.firstAidEye && (
                    <div style={{ marginTop: 2 }}>
                      <span style={{ fontWeight: 800, color: BRAND }}>First Aid – Eye: </span>
                      {safety.firstAidEye}
                    </div>
                  )}
                  {safety.skinContact && (
                    <div style={{ marginTop: 2 }}>
                      <span style={{ fontWeight: 800, color: BRAND }}>First Aid – Skin: </span>
                      {safety.skinContact}
                    </div>
                  )}
                  {safety.inhalationIngestion && (
                    <div style={{ marginTop: 2 }}>
                      <span style={{ fontWeight: 800, color: BRAND }}>Inhalation / Ingestion: </span>
                      {safety.inhalationIngestion.replace(/\n/g, "  ")}
                    </div>
                  )}
                  {safety.storage && (
                    <div style={{ marginTop: 2 }}>
                      <span style={{ fontWeight: 800, color: BRAND }}>Storage: </span>
                      {safety.storage}
                    </div>
                  )}
                  {safety.disposalSpill && (
                    <div style={{ marginTop: 2 }}>
                      <span style={{ fontWeight: 800, color: BRAND }}>Disposal / Spill: </span>
                      {safety.disposalSpill}
                    </div>
                  )}
                  {safety.fireClass && (
                    <div style={{ marginTop: 2 }}>
                      <span style={{ fontWeight: 800, color: BRAND }}>Fire: </span>
                      {safety.fireClass}
                    </div>
                  )}
                  <div style={{ marginTop: 2, fontWeight: 700 }}>
                    Keep out of reach of children. Refer to MSDS for full safety information.
                  </div>
                </div>
              </div>
            )}

            {/* ── Footer ── */}
            <div
              style={{
                padding: "5px 8px",
                textAlign: "center",
                fontSize: 9,
                lineHeight: 1.4,
                borderTop: `2.5px solid ${BRAND}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "2px 16px",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <GmailIcon />
                  {COMPANY.email}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <WhatsAppIcon />
                  {COMPANY.phone}
                </span>
              </div>
              <div style={{ fontWeight: 700, marginTop: 2 }}>{COMPANY.address}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalLabel;
