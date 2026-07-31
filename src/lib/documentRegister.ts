import type { DocKind } from "@/lib/docSequence";

/**
 * Register of documents that have actually been issued.
 *
 * Distinct from the in-progress draft (`quotation-draft-v3`), which is a single
 * slot for the form you are filling in right now. A document is recorded here
 * only when its PDF is generated, alongside the sequence number being
 * committed, so the register is a record of what went out rather than of what
 * was typed.
 *
 * Entries are keyed by kind + document number, so re-exporting the same
 * quotation updates its entry instead of adding a duplicate.
 */

const REGISTER_KEY = "laxmi-document-register-v1";

/**
 * Kept bounded because each entry carries a full form snapshot. Oldest entries
 * fall off the end; at roughly 1–2 KB each this stays far inside the ~5 MB
 * localStorage budget.
 */
const MAX_ENTRIES = 300;

export interface SavedDocument {
  /** `${kind}:${docNo}` — stable, so a re-export overwrites rather than adds. */
  id: string;
  kind: DocKind;
  docNo: string;
  /** ISO date from the form (yyyy-mm-dd). */
  docDate?: string;
  buyerName: string;
  contactName?: string;
  city?: string;
  grandTotal: number;
  itemCount: number;
  /** ISO timestamp of the last export of this document. */
  savedAt: string;
  /**
   * Full form snapshot used to reopen the document. Typed loosely here so the
   * register does not depend on the page's schema; the caller casts it back.
   */
  values: unknown;
}

export const documentId = (kind: DocKind, docNo: string) =>
  `${kind}:${docNo.trim()}`;

function readRegister(): SavedDocument[] {
  try {
    const raw = window.localStorage.getItem(REGISTER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedDocument[]) : [];
  } catch {
    return [];
  }
}

function writeRegister(entries: SavedDocument[]) {
  try {
    window.localStorage.setItem(REGISTER_KEY, JSON.stringify(entries));
  } catch {
    // A full or unavailable store must never block issuing a document.
  }
}

/** Every issued document, most recently exported first. */
export function listDocuments(): SavedDocument[] {
  return readRegister()
    .slice()
    .sort((a, b) => (a.savedAt < b.savedAt ? 1 : a.savedAt > b.savedAt ? -1 : 0));
}

/**
 * Record an issued document, replacing any earlier entry for the same kind and
 * number. Documents without a number are not recorded — there would be nothing
 * to key them by.
 */
export function saveDocument(
  entry: Omit<SavedDocument, "id" | "savedAt"> & { savedAt?: string }
): SavedDocument | null {
  if (!entry.docNo?.trim()) return null;

  const record: SavedDocument = {
    ...entry,
    id: documentId(entry.kind, entry.docNo),
    savedAt: entry.savedAt ?? new Date().toISOString(),
  };

  const others = readRegister().filter((doc) => doc.id !== record.id);
  // Newest first, then trim the tail so the store cannot grow without bound.
  writeRegister([record, ...others].slice(0, MAX_ENTRIES));
  return record;
}

export function deleteDocument(id: string): void {
  writeRegister(readRegister().filter((doc) => doc.id !== id));
}

/**
 * Free-text search across customer, contact, city and document number.
 * Every whitespace-separated term must match somewhere in the entry, so
 * "sundaram 251" finds that customer's quotation 251.
 */
export function searchDocuments(query: string, entries = listDocuments()): SavedDocument[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return entries;

  return entries.filter((doc) => {
    const haystack = [
      doc.docNo,
      doc.buyerName,
      doc.contactName ?? "",
      doc.city ?? "",
      doc.kind === "proforma" ? "proforma invoice" : "quotation",
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
