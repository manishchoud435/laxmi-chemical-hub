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
 * Share a generated document through WhatsApp or email.
 *
 * On phones and tablets the file is handed to the OS share sheet, where
 * WhatsApp, Gmail and Mail all appear as targets and receive the PDF as a real
 * attachment. On desktop that API doesn't accept files, and neither `wa.me`
 * nor `mailto:` can carry an attachment, so the file is downloaded and the
 * channel opens with the text prefilled for the user to attach it themselves.
 */
export async function shareDocument(
  channel: ShareChannel,
  { blob, fileName, title, message }: ShareDocumentInput
): Promise<ShareOutcome> {
  const nav = navigator as NavigatorWithShare;
  const file = new File([blob], fileName, {
    type: blob.type || "application/pdf",
  });

  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title, text: message });
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
