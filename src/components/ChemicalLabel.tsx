import "./ChemicalLabel.css";
import laxmiLogo from "@/assets/laxmi-chemicals-logo.png";
import type { ProductSafety } from "@/data/productSafety";

export interface ChemicalLabelProps {
  productName: string;
  batchNo: string;
  invoice: string;
  mfgDate: string;
  expDate: string;
  make: string;
  netQty: string;
  safety: ProductSafety;
}

/* ── Inline SVG Sub-Components ───────────────────── */

const LaxmiLogo = () => (
  <img src={laxmiLogo} alt="Laxmi Chemicals" className="cl__logo-img" />
);

const QrPlaceholder = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" fill="#FFF" stroke="#222" strokeWidth="0.5" />
    <rect x="2" y="2" width="8" height="8" fill="#111" />
    <rect x="20" y="2" width="8" height="8" fill="#111" />
    <rect x="2" y="20" width="8" height="8" fill="#111" />
    <rect x="4" y="4" width="4" height="4" fill="#FFF" />
    <rect x="22" y="4" width="4" height="4" fill="#FFF" />
    <rect x="4" y="22" width="4" height="4" fill="#FFF" />
    <rect x="12" y="3" width="2" height="2" fill="#111" />
    <rect x="15" y="5" width="2" height="2" fill="#111" />
    <rect x="12" y="8" width="2" height="2" fill="#111" />
    <rect x="17" y="11" width="2" height="2" fill="#111" />
    <rect x="13" y="13" width="2" height="2" fill="#111" />
    <rect x="19" y="14" width="2" height="2" fill="#111" />
    <rect x="12" y="16" width="2" height="2" fill="#111" />
    <rect x="15" y="18" width="2" height="2" fill="#111" />
    <rect x="18" y="20" width="2" height="2" fill="#111" />
    <rect x="14" y="22" width="2" height="2" fill="#111" />
    <rect x="20" y="24" width="2" height="2" fill="#111" />
    <rect x="16" y="25" width="2" height="2" fill="#111" />
    <rect x="23" y="22" width="2" height="2" fill="#111" />
    <rect x="25" y="18" width="2" height="2" fill="#111" />
  </svg>
);

const GhsFlame = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
    <polygon points="42,0 84,42 42,84 0,42" fill="#FFF" stroke="#C8102E" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M42 18 C 37 28, 28 33, 28 48 C 28 58, 33 65, 40 68 C 37 62, 39 55, 44 52 C 47 57, 45 63, 47 68 C 53 65, 58 58, 57 50 C 57 43, 52 39, 49 32 C 47 37, 44 35, 42 18 Z" fill="#111" />
    <rect x="30" y="62" width="24" height="3" rx="1" fill="#111" />
  </svg>
);

const GhsExclamation = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
    <polygon points="42,0 84,42 42,84 0,42" fill="#FFF" stroke="#C8102E" strokeWidth="3.5" strokeLinejoin="round" />
    <rect x="38" y="24" width="8" height="26" rx="1.5" fill="#111" />
    <circle cx="42" cy="60" r="4" fill="#111" />
  </svg>
);

/** Helper: render a data row only if value is non-empty */
const DataRow = ({ label, value, red }: { label: string; value: string; red?: boolean }) => {
  if (!value) return null;
  return (
    <>
      <div className="cl__data-row">
        <span className="cl__data-key">{label}</span>
        <span className="cl__data-colon">:</span>
        <span className={`cl__data-val${red ? " cl__data-val--red" : ""}`}>{value}</span>
      </div>
      <div className="cl__data-sep" />
    </>
  );
};

/* ── Label Component ─────────────────────────────── */

const ChemicalLabel = ({
  productName,
  batchNo,
  invoice,
  mfgDate,
  expDate,
  make,
  netQty,
  safety,
}: ChemicalLabelProps) => {
  return (
    <div className="cl">
      {/* ── Slanted Top Banner ──────────────────── */}
      <div className="cl__header">
        <span className="cl__header-text">{productName}</span>
      </div>

      {/* ── Body ────────────────────────────────── */}
      <div className="cl__body">
        {/* ── LEFT COLUMN ────────────────────────── */}
        <div className="cl__left">
          <div className="cl__marketed">Marketed By :</div>
          <div className="cl__logo"><LaxmiLogo /></div>

          <div className="cl__address">
            <div className="cl__address-name">LAXMI CHEMICALS</div>
            <div className="cl__address-line">Plot No. B-4, Hebbal Industrial Area,</div>
            <div className="cl__address-line">Mysore, Karnataka &ndash; 570016</div>
            <div className="cl__address-line">E-mail : <span className="cl__email">laxmichem7@gmail.com</span></div>
            <div className="cl__address-phone">
              <svg className="cl__wa-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.8-2.93-.19-.3A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" fill="#25D366" />
              </svg>
              +91 98861 74335
            </div>
          </div>

          <div className="cl__data-card">
            <DataRow label="MFG DATE" value={mfgDate} red />
            <DataRow label="INVOICE" value={invoice} red />
            <DataRow label="BATCH" value={batchNo} />
            <DataRow label="MAKE" value={make} />
            <DataRow label="EX DATE" value={expDate} red />
            <DataRow label="NET QTY" value={netQty} />
          </div>

          <div className="cl__qr">
            <QrPlaceholder />
            <div className="cl__qr-text">
              <div className="cl__qr-title">SCAN FOR MSDS</div>
              <div className="cl__qr-sub">Material Safety Data Sheet</div>
              <div className="cl__qr-sub">&amp; product certification</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ───────────────────────── */}
        <div className="cl__right">
          {/* Text sections — all driven by safety data */}
          <div className="cl__text-col">
            <div className="cl__section">
              <div className="cl__section-title">HAZARDOUS STATEMENT</div>
              <p className="cl__section-body">{safety.hazardous}</p>
            </div>

            <div className="cl__section">
              <div className="cl__section-title">PRECAUTIONARY STATEMENT</div>
              <p className="cl__section-body">
                {safety.precautionary.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {"\u2022"}&ensp;{line}
                  </span>
                ))}
              </p>
            </div>

            <div className="cl__section">
              <div className="cl__section-title">SKIN CONTACT</div>
              <p className="cl__section-body">{safety.skinContact}</p>
            </div>

            <div className="cl__section">
              <div className="cl__section-title">INHALATION &nbsp;/&nbsp; INGESTION</div>
              <p className="cl__section-body">
                {safety.inhalationIngestion.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </div>

            <div className="cl__section">
              <div className="cl__section-title">FIRST AID &nbsp;&ndash;&nbsp; EYE CONTACT</div>
              <p className="cl__section-body">{safety.firstAidEye}</p>
            </div>

            <div className="cl__section">
              <div className="cl__section-title">DISPOSAL &nbsp;/&nbsp; SPILL</div>
              <p className="cl__section-body">{safety.disposalSpill}</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="cl__icon-col">
            <div className="cl__icon-row-top">
              <div className="cl__dangerous">DANGEROUS!</div>
              <div className="cl__ghs-group">
                <div className="cl__ghs-row">
                  <div className="cl__ghs-item">
                    <div className="cl__ghs-diamond"><GhsFlame /></div>
                    <span className="cl__ghs-label">FLAMMABLE</span>
                  </div>
                  <div className="cl__ghs-item">
                    <div className="cl__ghs-diamond"><GhsExclamation /></div>
                    <span className="cl__ghs-label">HARMFUL</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="cl__extra">
              <div className="cl__extra-block">
                <span className="cl__extra-title">STORAGE:</span>
                <span className="cl__extra-text">{safety.storage}</span>
              </div>
              <span className="cl__extra-sep">|</span>
              <div className="cl__extra-block">
                <span className="cl__extra-title">FIRE CLASS:</span>
                <span className="cl__extra-text">{safety.fireClass}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Slanted Bottom Banner ───────────────── */}
      <div className="cl__footer">
        <span className="cl__footer-text">
          SEE MATERIAL SAFETY DATA SHEET FOR FURTHER INFORMATION
        </span>
      </div>
    </div>
  );
};

export default ChemicalLabel;
