import { toast } from "@/components/ui/sonner";

export type ShareChannel = "whatsapp" | "email";

export type ShareOutcome = "shared" | "cancelled" | "downloaded";

/** A generated file ready to be downloaded or shared. */
export interface GeneratedFile {
  blob: Blob;
  fileName: string;
}

export interface ShareDocumentInput extends GeneratedFile {
  /** Email subject, and the title handed to the native share sheet. */
  title: string;
  /** Prefilled WhatsApp / email body. */
  message: string;
  /**
   * Whether the caller already put `message` on the clipboard. Only affects the
   * wording of the hint shown after a WhatsApp share.
   */
  messageCopied?: boolean;
}

/**
 * Trigger a normal browser download for an already-generated blob. This is what
 * jsPDF's `save()` and html2pdf's `save()` do internally, so the existing
 * download buttons behave exactly as before once they route through here.
 */
export function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Safari needs the object URL to stay alive while the download starts.
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** `canShare`/`share` aren't in every TS DOM lib yet. */
type NavigatorWithShare = Navigator & {
  canShare?: (data: ShareData) => boolean;
  share?: (data: ShareData) => Promise<void>;
};

function openExternal(url: string, newTab: boolean) {
  const link = document.createElement("a");
  link.href = url;
  if (newTab) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function channelUrl(channel: ShareChannel, title: string, message: string) {
  return channel === "whatsapp"
    ? `https://wa.me/?text=${encodeURIComponent(message)}`
    : `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`;
}

/**
 * Copy text to the clipboard, reporting whether it worked.
 *
 * Call this while the click gesture is still active — the async clipboard API
 * requires transient activation, which a long PDF render would have used up.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or no secure context — try the legacy path below.
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  } catch {
    return false;
  }
}

/**
 * Share a generated document through WhatsApp or email.
 *
 * On phones and tablets the file is handed to the OS share sheet, where
 * WhatsApp, Gmail and Mail all appear as targets and receive the PDF as a real
 * attachment. On desktop that API doesn't accept files, and neither `wa.me`
 * nor `mailto:` can carry an attachment, so the file is downloaded and the
 * channel opens with the text prefilled for the user to attach it themselves.
 *
 * `text` is still sent with the file because Gmail and Mail use it as the body.
 * WhatsApp does not: given both a file and text it keeps only the file and
 * silently drops the caption. Nothing in the API can override that, so callers
 * copy the message to the clipboard first (see `messageCopied`) and the user
 * pastes it into the chat after the PDF.
 */
export async function shareDocument(
  channel: ShareChannel,
  { blob, fileName, title, message, messageCopied }: ShareDocumentInput
): Promise<ShareOutcome> {
  const nav = navigator as NavigatorWithShare;
  const file = new File([blob], fileName, {
    type: blob.type || "application/pdf",
  });

  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title, text: message });
      if (channel === "whatsapp") {
        toast.info(
          messageCopied
            ? "PDF shared. WhatsApp drops the caption, so the message is copied — paste it into the same chat."
            : "PDF shared. WhatsApp drops the caption, so the message has to be typed or pasted separately."
        );
      }
      return "shared";
    } catch (err) {
      // The user dismissing the sheet is not an error worth reporting.
      if ((err as DOMException | undefined)?.name === "AbortError") {
        return "cancelled";
      }
      console.error("Native share failed, falling back to download", err);
    }
  }

  saveBlob(blob, fileName);
  openExternal(channelUrl(channel, title, message), channel === "whatsapp");
  toast.info(
    channel === "whatsapp"
      ? `${fileName} downloaded — attach it in the WhatsApp chat that just opened.`
      : `${fileName} downloaded — attach it to the email draft that just opened.`
  );
  return "downloaded";
}
