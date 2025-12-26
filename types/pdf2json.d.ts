declare module "pdf2json" {
  import { EventEmitter } from "events";

  export default class PDFParser extends EventEmitter {
    constructor(context?: any, needRawText?: number);
    parseBuffer(buffer: Buffer): void;
    getRawTextContent(): string;
    on(event: "pdfParser_dataError", listener: (errData: any) => void): this;
    on(event: "pdfParser_dataReady", listener: (pdfData: any) => void): this;
  }
}
