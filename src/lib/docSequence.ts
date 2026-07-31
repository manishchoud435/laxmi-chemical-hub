/**
 * Running document-number sequence for quotations and proforma invoices.
 *
 * Numbers were previously random (`Math.random()`), so two documents could
 * collide and the order told you nothing. The ledger below keeps the last used
 * serial per document type per financial year in localStorage, so numbering
 * runs 001, 002, 003 … and restarts each April.
 *
 * The next number is only *shown* when the form loads — it is committed when a
 * PDF is actually generated, so abandoned drafts don't burn numbers.
 */

export type DocKind = "quotation" | "proforma";

const LEDGER_KEY = "laxmi-doc-sequence-v1";
const SERIAL_PAD = 3;

/** Indian financial year label for a date, e.g. `2026-27` (April → March). */
export function financialYear(date: Date = new Date()): string {
  const startYear = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

/** `LXM/2026-27/` for quotations, `LXM/PI/2026-27/` for proforma invoices. */
export function docPrefix(kind: DocKind, fy: string = financialYear()): string {
  return kind === "proforma" ? `LXM/PI/${fy}/` : `LXM/${fy}/`;
}

type Ledger = Record<string, number>;

const ledgerKey = (kind: DocKind, fy: string) => `${kind}:${fy}`;

function readLedger(): Ledger {
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Ledger;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLedger(ledger: Ledger) {
  try {
    window.localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
  } catch {
    // Private-browsing / quota failures shouldn't block document generation.
  }
}

/** Trailing serial of a document number, or null if it isn't numeric. */
function parseSerial(docNumber: string): number | null {
  const match = docNumber.trim().match(/(\d+)\s*$/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

/** Financial year embedded in a document number, e.g. `LXM/PI/2026-27/007`. */
function parseFinancialYear(docNumber: string): string | null {
  return docNumber.match(/(\d{4}-\d{2})/)?.[1] ?? null;
}

/**
 * The next number in sequence, without consuming it. Safe to call on every
 * render / form load.
 */
export function peekDocNumber(kind: DocKind): string {
  const fy = financialYear();
  const lastUsed = readLedger()[ledgerKey(kind, fy)] ?? 0;
  return `${docPrefix(kind, fy)}${String(lastUsed + 1).padStart(SERIAL_PAD, "0")}`;
}

/**
 * Record a document number as used, so the next one continues from it.
 *
 * Idempotent: exporting the same document twice does not advance the sequence.
 * A manually typed higher number pulls the ledger up to it; a non-numeric
 * custom number is left alone entirely.
 */
export function markDocNumberUsed(kind: DocKind, docNumber: string | undefined): void {
  if (!docNumber?.trim()) return;
  const serial = parseSerial(docNumber);
  if (serial === null) return;

  const fy = parseFinancialYear(docNumber) ?? financialYear();
  const key = ledgerKey(kind, fy);
  const ledger = readLedger();
  if (serial > (ledger[key] ?? 0)) {
    ledger[key] = serial;
    writeLedger(ledger);
  }
}
