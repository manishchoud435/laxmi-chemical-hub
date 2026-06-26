import "./ChemicalLabel.css";
import laxmiLogo from "@/assets/laxmi-chemicals-logo1.png";
import type { ProductSafety } from "@/data/productSafety";

export interface ChemicalLabelProps {
  productName: string;
  batchNo: string;
  invoice: string;
  mfgDate: string;
  expDate: string;
  make: string;
  netQty: string;
  tareQty: string;
  grossQty: string;
  safety: ProductSafety;
}

/* ── Inline SVG Sub-Components ───────────────────── */

const LaxmiLogo = () => (
  <img src={laxmiLogo} alt="Laxmi Chemicals" className="cl__logo-img" />
);

const GhsFlame = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Red-bordered diamond */}
    <polygon
      points="50,4 96,50 50,96 4,50"
      fill="#FFF"
      stroke="#D32F2F"
      strokeWidth="7"
      strokeLinejoin="round"
    />
    {/* Flame (taller — extends upward, same width) */}
    <path
      d="M50 18
         C 45 32, 37 40, 37 58
         C 37 67, 43 73, 49 74
         C 46 69, 48 63, 52 60
         C 55 64, 54 69, 56 74
         C 62 72, 65 66, 64 58
         C 64 48, 59 44, 57 36
         C 55 44, 52 42, 50 18 Z"
      fill="#000"
    />
    {/* Horizontal base bar under flame (narrower, fits inside diamond) */}
    <rect x="38" y="74" width="24" height="4" rx="1.5" fill="#000" />
  </svg>
);

const GhsExclamationTriangle = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Equilateral triangle with slightly rounded corners */}
    <path
      d="M50 8
         L91 80
         Q94 86, 88 86
         L12 86
         Q6 86, 9 80 Z"
      fill="#FFF"
      stroke="#D32F2F"
      strokeWidth="7"
      strokeLinejoin="round"
    />
    {/* Bold exclamation mark */}
    <rect x="46" y="32" width="8" height="32" rx="2" fill="#000" />
    <circle cx="50" cy="75" r="4.5" fill="#000" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="cl__wa-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      fill="#25D366"
    />
    <path
      d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.8-2.93-.19-.3A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"
      fill="#25D366"
    />
  </svg>
);

/** Helper: render a data row. `alwaysShow` keeps the row visible even if value is empty. */
const DataRow = ({
  label,
  value,
  red,
  alwaysShow,
}: {
  label: string;
  value: string;
  red?: boolean;
  alwaysShow?: boolean;
}) => {
  if (!value && !alwaysShow) return null;
  return (
    <div className="cl__data-row">
      <span className="cl__data-key">{label}</span>
      <span className="cl__data-colon">:</span>
      <span className={`cl__data-val${red ? " cl__data-val--red" : ""}`}>{value}</span>
    </div>
  );
};

/** Split "Inhalation – ... \n Ingestion – ..." into two clean strings */
const splitInhalationIngestion = (combined: string): [string, string] => {
  const parts = combined.split("\n");
  const inhalation = (parts[0] || "").replace(/^\s*Inhalation\s*[\u2013-]\s*/i, "");
  const ingestion = (parts[1] || "").replace(/^\s*Ingestion\s*[\u2013-]\s*/i, "");
  return [inhalation, ingestion];
};

/** Put any trailing "Seek/Get … medical attention" sentence on a new line */
const formatFirstAid = (text: string) => {
  const match = text.match(/^(.*?)(\s*(?:Seek|Get)\s+[^.]*?medical attention[^.]*\.\s*)$/i);
  if (match) {
    return (
      <>
        {match[1].trim()}
        <br />
        {match[2].trim()}
      </>
    );
  }
  return text;
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
  tareQty,
  grossQty,
  safety,
}: ChemicalLabelProps) => {
  const [inhalation, ingestion] = splitInhalationIngestion(safety.inhalationIngestion);

  return (
    <div className="cl">
      {/* ── Top Red Banner ──────────────────────── */}
      <div className="cl__header">
        <span className="cl__header-text">{productName}</span>
      </div>

      {/* ── Body — 3 Columns ────────────────────── */}
      <div className="cl__body">
        {/* ═════ COLUMN 1 — Company Info ═════ */}
        <div className="cl__col cl__col--1">
          <div className="cl__marketed">Marketed By :</div>
          <div className="cl__logo"><LaxmiLogo /></div>

          <div className="cl__company-name">LAXMI CHEMICALS</div>
          <div className="cl__address-line">Plot No.B-4, Hebbal Industrial Area,</div>
          <div className="cl__address-line">Mysore, Karnataka &ndash; 570016</div>
          <div className="cl__address-line">
            E-mail : <span className="cl__email">laxmichem7@gmail.com</span>
          </div>
          <div className="cl__address-phone">
            <WhatsAppIcon />
            +91 9886174335
          </div>

          <div className="cl__data-card">
            <DataRow label="INVOICE NO" value={invoice} red alwaysShow />
            <DataRow label="BATCH" value={batchNo} alwaysShow />
            <DataRow label="MFG DATE" value={mfgDate} red alwaysShow />
            <DataRow label="EXP DATE" value={expDate} red alwaysShow />
            <DataRow label="NET QTY" value={netQty} />
            <DataRow label="TARE QTY" value={tareQty} />
            <DataRow label="GROSS QTY" value={grossQty} />
            <div className="cl__data-row cl__data-row--make">
              <span className="cl__data-key">MAKE</span>
              <span className="cl__data-colon">:</span>
              <span className="cl__data-val">{make}</span>
            </div>
          </div>
        </div>

        {/* ═════ COLUMN 2 — Hazards + First Aid + DANGEROUS ═════ */}
        <div className="cl__col cl__col--2">
          <div className="cl__section">
            <div className="cl__section-title">HAZARDOUS STATEMENT</div>
            <p className="cl__section-body">{safety.hazardous}</p>
          </div>

          <div className="cl__section">
            <div className="cl__section-title">PRECAUTIONARY STATEMENT</div>
            <div className="cl__section-body">
              {safety.precautionary
                .flatMap((item) => item.split(/(?<=\.)\s+/))
                .map((s) => s.trim())
                .filter(Boolean)
                .map((sentence, i) => (
                  <div key={i}>{sentence}</div>
                ))}
            </div>
          </div>

          <div className="cl__section">
            <div className="cl__section-title">FIRST AID MEASURES</div>
            <div className="cl__section-subtitle">EYE CONTACT</div>
            <p className="cl__section-body">{formatFirstAid(safety.firstAidEye)}</p>
          </div>

          {safety.fireClass && (
            <div className="cl__section">
              <div className="cl__section-subtitle">FIRE CLASS</div>
              <p className="cl__section-body">{safety.fireClass}</p>
            </div>
          )}

          <div className="cl__section">
            <div className="cl__section-subtitle">KEEP OUT OF REACH OF CHILDREN</div>
            <div className="cl__section-body">
              <div>Store in original container.</div>
              <div>Keep container tightly closed.</div>
              <div>Keep locked and away from children.</div>
            </div>
          </div>

          <div className="cl__dangerous-wrap">
            <div className="cl__dangerous">DANGEROUS!</div>
          </div>
        </div>

        {/* ═════ COLUMN 3 — Exposure Response + Pictograms ═════ */}
        <div className="cl__col cl__col--3">
          <div className="cl__section">
            <div className="cl__section-subtitle">SKIN CONTACT</div>
            <p className="cl__section-body">{safety.skinContact}</p>
          </div>

          {inhalation && (
            <div className="cl__section">
              <div className="cl__section-subtitle">INHALATION</div>
              <p className="cl__section-body">{inhalation}</p>
            </div>
          )}

          {ingestion && (
            <div className="cl__section">
              <div className="cl__section-subtitle">INGESTION</div>
              <p className="cl__section-body">{ingestion}</p>
            </div>
          )}

          {safety.storage && (
            <div className="cl__section">
              <div className="cl__section-subtitle">STORAGE</div>
              <p className="cl__section-body">{safety.storage}</p>
            </div>
          )}

          {safety.disposalSpill && (
            <div className="cl__section">
              <div className="cl__section-subtitle">DISPOSAL / SPILL</div>
              <p className="cl__section-body">{safety.disposalSpill}</p>
            </div>
          )}

          <div className="cl__pictograms">
            <div className="cl__pictogram cl__pictogram--triangle"><GhsExclamationTriangle /></div>
            <div className="cl__pictogram"><GhsFlame /></div>
          </div>
        </div>
      </div>

      {/* ── Bottom Red Banner ───────────────────── */}
      <div className="cl__footer">
        <span className="cl__footer-text">
          SEE MATERIAL SAFETY DATA SHEET FOR FURTHER REGARDING THIS PRODUCT
        </span>
      </div>
    </div>
  );
};

export default ChemicalLabel;
