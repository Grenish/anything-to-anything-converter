import { marked } from "marked";
import TurndownService from "turndown";

export async function convertDocument(
  input: Buffer,
  from: string,
  to: string
): Promise<Buffer> {
  const content = input.toString("utf-8");

  // Markdown → HTML
  if (from === "markdown" && to === "html") {
    const html = await marked.parse(content);
    return Buffer.from(html);
  }

  // HTML → Markdown
  if (from === "html" && to === "markdown") {
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(content);
    return Buffer.from(markdown);
  }

  // HTML → PDF
  if (from === "html" && to === "pdf") {
    const puppeteer = (await import("puppeteer")).default;
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(content, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  // Markdown → PDF
  if (from === "markdown" && to === "pdf") {
    const puppeteer = (await import("puppeteer")).default;
    const html = await marked.parse(content);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    // Wrap in some basic styling for better PDF output
    const styledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1, h2, h3 { color: #333; }
          code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
          pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
          blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
          img { max-width: 100%; height: auto; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
    await page.setContent(styledHtml, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  // PDF → Text
  if (from === "pdf" && to === "text") {
    const PDFParser = (await import("pdf2json")).default;
    const parser = new PDFParser(null, 1);

    return new Promise((resolve, reject) => {
      parser.on("pdfParser_dataError", (errData: any) =>
        reject(new Error(errData.parserError))
      );
      parser.on("pdfParser_dataReady", () => {
        const text = parser.getRawTextContent();
        resolve(Buffer.from(text));
      });
      parser.parseBuffer(input);
    });
  }

  throw new Error(`Unsupported document conversion: ${from} → ${to}`);
}
