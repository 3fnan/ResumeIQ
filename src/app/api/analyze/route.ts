export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPdf } from '@/utils/pdf';
import { analyzeResumeWithGemini } from '@/utils/gemini';



export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Missing file. Please upload a PDF resume.' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF files are supported.' },
        { status: 400 }
      );
    }

    // Convert file to ArrayBuffer and then Buffer for pdf-parse compatibility
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 1: Parse PDF text
    let resumeText = '';
    try {
      resumeText = await extractTextFromPdf(buffer);
    } catch (parseError: any) {
      return NextResponse.json(
        { error: `PDF parsing failed: ${parseError.message || parseError}` },
        { status: 500 }
      );
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: 'The PDF file appears to be empty or contains no readable text.' },
        { status: 400 }
      );
    }

    // Step 2: Query Gemini API for analysis
    const analysisResult = await analyzeResumeWithGemini(
      resumeText,
      jobDescription || undefined
    );

    return NextResponse.json(analysisResult, { status: 200 });

  } catch (error: any) {
    console.error('API Error in /api/analyze:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during analysis.' },
      { status: 500 }
    );
  }
}
