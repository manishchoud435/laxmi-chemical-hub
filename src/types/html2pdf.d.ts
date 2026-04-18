declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      backgroundColor?: string | null;
      windowWidth?: number;
      logging?: boolean;
      allowTaint?: boolean;
      onclone?: (clonedDoc: Document) => void;
    };
    jsPDF?: { unit?: string; format?: string | number[]; orientation?: "portrait" | "landscape" };
    pagebreak?: { mode?: string | string[] };
  }

  interface Html2Pdf {
    from(element: HTMLElement): Html2Pdf;
    set(options: Html2PdfOptions): Html2Pdf;
    save(): Promise<void>;
    output(type?: string): Promise<unknown>;
    outputPdf(type?: string): Promise<unknown>;
  }

  function html2pdf(): Html2Pdf;
  export default html2pdf;
}
