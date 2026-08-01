import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteDocument,
  listDocuments,
  searchDocuments,
  type SavedDocument,
} from "@/lib/documentRegister";
import { formatDocDate, inr } from "@/lib/quotationMessage";

export interface DocumentRegisterProps {
  /** Reopen the document as it was issued, keeping its number. */
  onOpen: (doc: SavedDocument) => void;
  /** Copy the contents onto the next number of the same kind. */
  onDuplicate: (doc: SavedDocument) => void;
  /** Copy a quotation onto the next proforma-invoice number. */
  onConvert: (doc: SavedDocument) => void;
  /**
   * Bumped by the page whenever a document is issued, so the list picks up the
   * new entry without a reload.
   */
  refreshToken: number;
}

const DocumentRegister = ({
  onOpen,
  onDuplicate,
  onConvert,
  refreshToken,
}: DocumentRegisterProps) => {
  const [entries, setEntries] = useState<SavedDocument[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEntries(listDocuments());
  }, [refreshToken]);

  const results = useMemo(() => searchDocuments(query, entries), [query, entries]);

  const handleDelete = (doc: SavedDocument) => {
    deleteDocument(doc.id);
    setEntries(listDocuments());
  };

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">
            Register
          </p>
          <h2 className="mt-1 text-xl font-semibold sm:mt-2 sm:text-2xl">
            Issued Documents
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {entries.length === 0
              ? "Nothing issued yet — documents are recorded when their PDF is generated."
              : `${entries.length} document${entries.length === 1 ? "" : "s"} on this device.`}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setOpen((prev) => !prev)}
          className="shrink-0 text-xs sm:text-sm"
        >
          {open ? "Hide register" : "Open register"}
        </Button>
      </div>

      {open && (
        <div className="mt-5 space-y-4 sm:mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by customer, contact, city or number…"
              className="pl-9 text-sm"
            />
          </div>

          {results.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              {entries.length === 0
                ? "No documents yet."
                : `Nothing matches “${query}”.`}
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {results.map((doc) => (
                <li key={doc.id} className="bg-white p-3 sm:p-4 dark:bg-slate-950">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {doc.kind === "proforma" ? "Proforma" : "Quotation"}
                    </span>
                    <span className="font-mono text-xs font-semibold sm:text-sm">
                      {doc.docNo}
                    </span>
                    {doc.docDate && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDocDate(doc.docDate)}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                    {doc.buyerName || "—"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {[
                      doc.contactName,
                      doc.city,
                      `${doc.itemCount} item${doc.itemCount === 1 ? "" : "s"}`,
                      doc.grandTotal > 0 ? inr(doc.grandTotal) : "",
                    ]
                      .filter(Boolean)
                      .join("  ·  ")}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onOpen(doc)}
                      className="text-xs"
                    >
                      Open
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onDuplicate(doc)}
                      className="text-xs"
                    >
                      Duplicate &amp; revise
                    </Button>
                    {doc.kind === "quotation" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onConvert(doc)}
                        className="text-xs"
                      >
                        Convert to proforma
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc)}
                      className="text-xs text-destructive hover:bg-destructive/10"
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

export default DocumentRegister;
