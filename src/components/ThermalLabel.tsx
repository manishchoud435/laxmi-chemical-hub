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
  size?: "3x5" | "4x4" | "4x6";
  /**
   * Rotate the content 90° so it prints correctly when the label is applied
   * (stuck) sideways on the drum. On by default — the physical media stays
   * portrait, the artwork is laid out landscape and turned to fill it.
   */
  rotate?: boolean;
}

const containerSizes: Record<string, { width: string; height: string }> = {
  "3x5": { width: "3in", height: "5in" },
  "4x4": { width: "4in", height: "4in" },
  "4x6": { width: "4in", height: "6in" },
};

/* ── Code 128-B barcode (self-contained, scannable) ──── */

const CODE128 = [
  "212222","222122","222221","121223","121322","131222","122213","122312","132212","221213",
  "221312","231212","112232","122132","122231","113222","123122","123221","223211","221132",
  "221231","213212","223112","312131","311222","321122","321221","312212","322112","322211",
  "212123","212321","232121","111323","131123","131321","112313","132113","132311","211313",
  "231113","231311","112133","112331","132131","113123","113321","133121","313121","211331",
  "231131","213113","213311","213131","311123","311321","331121","312113","312311","332111",
  "314111","221411","431111","111224","111422","121124","121421","141122","141221","112214",
  "112412","122114","122411","142112","142211","241211","221114","413111","241112","134111",
  "111242","121142","121241","114212","124112","124211","411212","421112","421211","212141",
  "214121","412121","111143","111341","131141","114113","114311","411113","411311","113141",
  "114131","311141","411131","211412","211214","211232","2331112",
];

const code128Bars = (raw: string): string | null => {
  const data = raw.replace(/[^\x20-\x7E]/g, "");
  if (!data) return null;
  const values = Array.from(data).map((c) => c.charCodeAt(0) - 32);
  const start = 104; // Start Code B
  let checksum = start;
  values.forEach((v, i) => (checksum += v * (i + 1)));
  const codes = [start, ...values, checksum % 103, 106 /* Stop */];
  return codes.map((c) => CODE128[c]).join("");
};

const Barcode = ({ value, height = 30 }: { value: string; height?: number }) => {
  const bars = code128Bars(value);
  if (!bars) return null;
  const unit = 1.25;
  const rects: React.ReactNode[] = [];
  let x = 0;
  let bar = true;
  Array.from(bars).forEach((d, i) => {
    const w = parseInt(d, 10) * unit;
    if (bar) rects.push(<rect key={i} x={x} y={0} width={w} height={height} fill="#000" />);
    x += w;
    bar = !bar;
  });
  return (
    <svg
      width={x}
      height={height}
      viewBox={`0 0 ${x} ${height}`}
      shapeRendering="crispEdges"
      style={{ display: "block" }}
    >
      {rects}
    </svg>
  );
};

/* ── GHS pictograms (black & white) ─────────────────── */

const GhsFlame = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <polygon points="50,4 96,50 50,96 4,50" fill="#FFF" stroke="#000" strokeWidth="7" strokeLinejoin="round" />
    <path
      d="M50 18 C 45 32, 37 40, 37 58 C 37 67, 43 73, 49 74 C 46 69, 48 63, 52 60 C 55 64, 54 69, 56 74 C 62 72, 65 66, 64 58 C 64 48, 59 44, 57 36 C 55 44, 52 42, 50 18 Z"
      fill="#000"
    />
    <rect x="38" y="74" width="24" height="4" rx="1.5" fill="#000" />
  </svg>
);

const GhsExclamation = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M50 8 L91 80 Q94 86, 88 86 L12 86 Q6 86, 9 80 Z" fill="#FFF" stroke="#000" strokeWidth="7" strokeLinejoin="round" />
    <rect x="46" y="32" width="8" height="32" rx="2" fill="#000" />
    <circle cx="50" cy="75" r="4.5" fill="#000" />
  </svg>
);

/* ── Contact icons (black & white) ──────────────────── */

const WhatsAppIcon = ({ size = 11 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ flex: "0 0 auto", verticalAlign: "-1px" }}>
    <path
      d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.8-2.93-.19-.3A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"
      fill="#000"
    />
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      fill="#000"
    />
  </svg>
);

const GmailIcon = ({ size = 11 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ flex: "0 0 auto", verticalAlign: "-1px" }}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" fill="#fff" stroke="#000" strokeWidth="1.8" />
    <path d="M3.2 6.4 L12 13 L20.8 6.4" fill="none" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

/* ── Data cell — hidden when empty ──────────────────── */

const Cell = ({
  label,
  value,
  span,
  right,
}: {
  label: string;
  value?: string;
  span?: boolean;
  right?: boolean;
}) => {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        fontSize: 11,
        lineHeight: 1.3,
        padding: "4px 8px",
        borderBottom: "1px solid #000",
        borderRight: right ? "none" : "1px solid #000",
        gridColumn: span ? "1 / -1" : "auto",
        minWidth: 0,
      }}
    >
      <span style={{ fontWeight: 800, flex: "0 0 68px", letterSpacing: 0.3 }}>{label}</span>
      <span style={{ fontWeight: 800 }}>:</span>
      <span style={{ marginLeft: 6, flex: 1, fontWeight: 600, wordBreak: "break-word", minWidth: 0 }}>
        {value}
      </span>
    </div>
  );
};

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
  size = "3x5",
  rotate = true,
}: ThermalLabelProps) => {
  const dims = containerSizes[size] || containerSizes["3x5"];

  // When rotating, the artwork is laid out in the swapped (landscape)
  // dimensions and then turned 90° to fill the physical portrait media.
  const innerStyle: React.CSSProperties = rotate
    ? {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: dims.height,
        height: dims.width,
        transform: "translate(-50%, -50%) rotate(90deg)",
      }
    : { width: "100%", height: "100%" };

  const precautions = (safety?.precautionary || []).slice(0, 4).join("  •  ");
  const barcodeValue = batchNo || invoice || "";

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
      <div
        style={{
          ...innerStyle,
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
            border: "2.5px solid #000",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* ── Header: logo + company ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 8px",
              borderBottom: "2.5px solid #000",
            }}
          >
            <img
              src={laxmiLogo}
              alt="Laxmi Chemicals"
              style={{ height: 36, width: "auto", objectFit: "contain", filter: "grayscale(1)" }}
            />
            <div style={{ flex: 1, lineHeight: 1.12, minWidth: 0 }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
                Marketed By
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 900, letterSpacing: 0.4 }}>{COMPANY.name}</div>
              <div style={{ fontSize: 8.5, fontWeight: 600 }}>{COMPANY.tagline}</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 8, lineHeight: 1.3 }}>
              <div style={{ fontWeight: 800, letterSpacing: 0.5 }}>GSTIN</div>
              <div style={{ fontWeight: 600 }}>{COMPANY.gst}</div>
            </div>
          </div>

          {/* ── Product name banner ── */}
          <div
            style={{
              background: "#000",
              color: "#fff",
              textAlign: "center",
              padding: "7px 8px",
              fontSize: 19,
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: "uppercase",
              wordBreak: "break-word",
              lineHeight: 1.05,
            }}
          >
            {productName}
          </div>

          {/* ── Data table — only filled-in fields ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignContent: "start",
              borderBottom: "2.5px solid #000",
            }}
          >
            <Cell label="INVOICE" value={invoice} />
            <Cell label="MFG DATE" value={mfgDate} right />
            <Cell label="BATCH" value={batchNo} />
            <Cell label="EXP DATE" value={expDate} right />
            <Cell label="NET QTY" value={netQty} />
            <Cell label="TARE QTY" value={tareQty} right />
            <Cell label="GROSS QTY" value={grossQty} />
            <Cell label="MAKE" value={make} right span={!grossQty} />
          </div>

          {/* ── Hazard & safety — fills the remaining space ── */}
          {safety && (
            <div
              style={{
                flex: 1,
                display: "flex",
                gap: 8,
                padding: "6px 10px",
                minHeight: 0,
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
                  gap: 5,
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
                    border: "2px solid #000",
                    padding: "1px 14px",
                    fontWeight: 900,
                    fontSize: 13,
                    letterSpacing: 2.5,
                  }}
                >
                  DANGER
                </div>
              </div>

              {/* Safety text */}
              <div style={{ flex: 1, fontSize: 9.5, lineHeight: 1.32, overflow: "hidden", minWidth: 0 }}>
                {safety.hazardous && (
                  <div>
                    <span style={{ fontWeight: 800 }}>Hazard: </span>
                    {safety.hazardous}
                  </div>
                )}
                {precautions && (
                  <div style={{ marginTop: 3 }}>
                    <span style={{ fontWeight: 800 }}>Precautions: </span>
                    {precautions}
                  </div>
                )}
                {safety.storage && (
                  <div style={{ marginTop: 3 }}>
                    <span style={{ fontWeight: 800 }}>Storage: </span>
                    {safety.storage}
                  </div>
                )}
                {safety.fireClass && (
                  <div style={{ marginTop: 3 }}>
                    <span style={{ fontWeight: 800 }}>Fire: </span>
                    {safety.fireClass}
                  </div>
                )}
                <div style={{ marginTop: 3, fontWeight: 700 }}>
                  Keep out of reach of children. Refer to MSDS for full safety information.
                </div>
              </div>
            </div>
          )}

          {/* ── Footer: barcode + contact ── */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              borderTop: "2.5px solid #000",
            }}
          >
            {barcodeValue && (
              <div
                style={{
                  flex: "0 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 8px",
                  borderRight: "2px solid #000",
                }}
              >
                <Barcode value={barcodeValue} height={28} />
                <div style={{ fontSize: 8, letterSpacing: 1.5, fontWeight: 700, marginTop: 1 }}>
                  {barcodeValue}
                </div>
              </div>
            )}
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 8.5,
                lineHeight: 1.4,
                padding: "4px 8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontWeight: 700 }}>{COMPANY.address}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "2px 10px",
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalLabel;
