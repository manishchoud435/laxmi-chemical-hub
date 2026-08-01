import { useEffect, useState } from "react";
import { Check, ClipboardCopy, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  copyToClipboard,
  openWhatsAppWithMessage,
  shareDocument,
  type GeneratedFile,
  type ShareChannel,
} from "@/lib/shareDocument";

export interface ShareDocumentButtonsProps {
  /**
   * Builds the file to share. Return `null` to abort silently — the generator
   * is expected to have surfaced its own error toast in that case.
   */
  onGenerate: () => Promise<GeneratedFile | null>;
  /** Email subject, and the title handed to the native share sheet. */
  title: string;
  /**
   * Prefilled body. Pass a function to tailor the wording per channel.
   */
  message: string | ((channel: ShareChannel) => string);
  disabled?: boolean;
  className?: string;
}

/**
 * WhatsApp + Email share actions for a generated document, alongside a copy
 * box for the covering note.
 *
 * WhatsApp takes a file or text from a share, never both, so the note cannot
 * ride along with the PDF. Once the PDF has been shared the note is put in
 * front of the user to copy and paste into the same chat — the box opens by
 * itself after a WhatsApp share, and "Message" reopens it at any time.
 *
 * The box is a dialog so it can be portalled out of the button row; callers
 * drop this component into tight flex layouts.
 */
const ShareDocumentButtons = ({
  onGenerate,
  title,
  message,
  disabled,
  className,
}: ShareDocumentButtonsProps) => {
  const [busy, setBusy] = useState<ShareChannel | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [copied, setCopied] = useState(false);

  const body = typeof message === "function" ? message("whatsapp") : message;

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    setCopied(await copyToClipboard(body));
  };

  const handleShare = async (channel: ShareChannel) => {
    if (busy) return;
    setBusy(channel);
    try {
      const channelBody = typeof message === "function" ? message(channel) : message;

      // Copy before rendering the PDF: the clipboard API needs the click still
      // to be active, and rendering takes long enough to lose that activation.
      const messageCopied =
        channel === "whatsapp" ? await copyToClipboard(channelBody) : false;

      const file = await onGenerate();
      if (!file) return;

      const outcome = await shareDocument(channel, {
        ...file,
        title,
        message: channelBody,
        messageCopied,
      });

      // The PDF is now in the chat but the note is not, so put it on screen
      // ready to paste underneath it.
      if (channel === "whatsapp" && outcome === "shared") {
        setCopied(messageCopied);
        setShowMessage(true);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={className}
        onClick={() => handleShare("whatsapp")}
        disabled={disabled || busy !== null}
      >
        <MessageCircle className="mr-1.5 h-4 w-4" />
        {busy === "whatsapp" ? "Preparing…" : "WhatsApp"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={className}
        onClick={() => handleShare("email")}
        disabled={disabled || busy !== null}
      >
        <Mail className="mr-1.5 h-4 w-4" />
        {busy === "email" ? "Preparing…" : "Email"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={className}
        onClick={() => setShowMessage(true)}
        title="Show the covering note so it can be copied"
      >
        <ClipboardCopy className="mr-1.5 h-4 w-4" />
        Message
      </Button>

      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message for WhatsApp</DialogTitle>
            <DialogDescription>
              WhatsApp can&apos;t attach this to the PDF. Copy it and paste it
              into the same chat, right under the document.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            readOnly
            value={body}
            rows={12}
            onFocus={(event) => event.currentTarget.select()}
            className="resize-none whitespace-pre-wrap text-xs leading-5"
          />

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openWhatsAppWithMessage(body)}
            >
              <MessageCircle className="mr-1.5 h-4 w-4" />
              Open WhatsApp
            </Button>
            <Button type="button" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-1.5 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardCopy className="mr-1.5 h-4 w-4" />
                  Copy message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareDocumentButtons;
