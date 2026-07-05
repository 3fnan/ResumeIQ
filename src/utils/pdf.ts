// This import MUST come before importing PDFParse — it sets up
// the canvas/DOMMatrix polyfills that pdfjs-dist needs under the hood
import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({
        data: new Uint8Array(buffer),
        CanvasFactory, // pass it explicitly to the constructor
    });

    try {
        const result = await parser.getText();
        return result.text ?? "";
    } finally {
        await parser.destroy();
    }
}