import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
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
   * Prefilled body. Pass a function to tailor the wording per channel — e.g. a
   * formal letter for email and a tighter note for WhatsApp.
   */
  message: string | ((channel: ShareChannel) => string);
  disabled?: boolean;
  className?: string;
}

/**
 * WhatsApp + Email share actions for a generated document. Sits alongside the
 * existing download buttons and reuses the same generator, so the download
 * flow is untouched.
 */
const ShareDocumentButtons = ({
  onGenerate,
  title,
  message,
  disabled,
  className,
}: ShareDocumentButtonsProps) => {
  const [busy, setBusy] = useState<ShareChannel | null>(null);

  const handleShare = async (channel: ShareChannel) => {
    if (busy) return;
    setBusy(channel);
    try {
      const file = await onGenerate();
      if (!file) return;
      const body = typeof message === "function" ? message(channel) : message;
      await shareDocument(channel, { ...file, title, message: body });
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
    </>
  );
};

export default ShareDocumentButtons;
