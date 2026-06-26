import "./MsdsSheet.css";
import logo from "@/assets/laxmi-chemicals-logo1.png";
import { COMPANY } from "@/data/company";
import type { MsdsData } from "@/data/msdsData";

interface MsdsSheetProps {
  data: MsdsData;
  /** Issue date as DD-MM-YYYY. */
  issueDate: string;
  /** Revision date as DD-MM-YYYY. */
  revisionDate: string;
}

/** Renders one cell value, monospacing identifier-like values (CAS / UN / EINECS). */
const renderValue = (label: string, value: string) => {
  const monoLabels = ["CAS No.", "INDEX No.", "EINECS No.", "UN No.", "GSTIN"];
  return monoLabels.includes(label) ? <span className="msds-mono">{value}</span> : value;
};

export const MsdsSheet = ({ data, issueDate, revisionDate }: MsdsSheetProps) => (
  <article className="msds-sheet">
    {/* Faint watermark — one centred logo per A4 page band (≈1142px at this
        794px sheet width). Extra logos past the content are clipped by the
        sheet's overflow:hidden. */}
    {Array.from({ length: 15 }).map((_, i) => (
      <img
        key={i}
        src={logo}
        alt=""
        aria-hidden="true"
        className="msds-watermark-logo"
        style={{ top: `${(i + 0.5) * 1142}px` }}
      />
    ))}

    <div className="msds-body">
    {/* ── Letterhead ── */}
    <header className="msds-head">
      <div className="msds-head__co">
        <img className="msds-head__logo" src={logo} alt="Laxmi Chemicals" />
        <div>
          <div className="msds-brand__name">{COMPANY.name}</div>
          <div className="msds-brand__tag">{COMPANY.tagline}</div>
          <div className="msds-brand__addr">
            <b>{COMPANY.address}</b>
            <br />
            GSTIN: <span className="msds-mono">{COMPANY.gst}</span> &nbsp;•&nbsp; Ph: {COMPANY.phone}
            <br />
            Email: {COMPANY.email}
          </div>
        </div>
      </div>
      <div className="msds-meta">
        <span className="msds-meta__badge">MSDS</span>
        <dl>
          <dt>Doc Ref</dt>
          <dd>{data.docRef}</dd>
          <dt>Issue Date</dt>
          <dd>{issueDate}</dd>
          <dt>Revision</dt>
          <dd>{revisionDate}</dd>
          <dt>Version</dt>
          <dd>2.0</dd>
        </dl>
      </div>
    </header>

    {/* ── Title ── */}
    <div className="msds-title">
      <div className="msds-title__eyebrow">Material Safety Data Sheet</div>
      <div className="msds-title__name">{data.productName}</div>
      <div className="msds-title__rule" />
    </div>

    {/* ── 16 Sections ── */}
    {data.sections.map((sec, i) => (
      <section className="msds-sec" key={i}>
        <div className="msds-sec__head">
          <span className="msds-sec__num">{i + 1}</span>
          <span className="msds-sec__title">{sec.title}</span>
        </div>

        {sec.rows && sec.rows.length > 0 && (
          <dl className="msds-dl">
            {sec.rows.map((row) => (
              <div className="msds-row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{renderValue(row.label, row.value)}</dd>
              </div>
            ))}
          </dl>
        )}

        {sec.table && (
          <div className="msds-tbl-wrap">
            <table className="msds-tbl">
              <thead>
                <tr>
                  {sec.table.headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sec.table.rows.map((r, ri) => (
                  <tr key={ri}>
                    {r.map((c, ci) => (
                      <td key={ci}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    ))}

    {/* ── Disclaimer ── */}
    <div className="msds-disclaimer">
      <b>Disclaimer:</b> The information and recommendations contained herein are, to the best of{" "}
      <b>{COMPANY.name}</b>' knowledge and belief, accurate and reliable as of the date issued. They are
      offered for the user's consideration and examination. It is the user's responsibility to satisfy
      themselves that the product is suitable for the intended use. If the buyer repackages this product, it
      is the user's responsibility to ensure proper health, safety and handling information is provided to
      handlers and users.
    </div>

    </div>
  </article>
);

export default MsdsSheet;
