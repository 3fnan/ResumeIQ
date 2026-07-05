import { PDFParse } from "pdf-parse";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({
        data: new Uint8Array(buffer),
    });

    try {
        const result = await parser.getText();

        return result.text ?? "";
    } finally {
        // Clean up resources
        await parser.destroy();
    }
}