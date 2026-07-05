import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeAnalysisResult } from '../types';

// Initialize the Gemini API client
// Note: GEMINI_API_KEY should be set in the .env.local file
const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined.");
  }

  return new GoogleGenerativeAI(apiKey);
};

/**
 * Sends the parsed resume text and optional job description to Gemini
 * and receives a detailed analysis in a structured JSON format.
 */
export async function analyzeResumeWithGemini(
  resumeText: string,
  jobDescription?: string
): Promise<ResumeAnalysisResult> {
  const genAI = getGeminiClient();

  // Use gemini-2.5-flash as it is the recommended model for general text and JSON generation
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const prompt = `
You are an expert Executive Technical Recruiter, ATS (Applicant Tracking System) Specialist, and Career Coach. 
Your task is to analyze the following candidate Resume Text, and optionally a Job Description if provided.
You must return a highly detailed, professional, and actionable career analysis in JSON format.

---
RESUME TEXT:
${resumeText}

${jobDescription ? `---
JOB DESCRIPTION:
${jobDescription}` : ''}
---

Your response MUST be a JSON object that adheres EXACTLY to the following TypeScript structure:

\`\`\`typescript
interface Skill {
  name: string;
  category: string; // e.g., 'Frontend', 'Backend', 'DevOps', 'Data Science', 'Soft Skills', 'Product Management'
}

interface ResumeImprovementItem {
  original: string; // A bullet point or sentence from the resume that needs improvement
  improved: string; // A rewritten, high-impact version with active verbs and quantified results (metrics)
  rationale: string; // Detailed reason why this rewrite is better and what principles it follows
}

interface JobMatchInfo {
  match_percentage: number; // An integer between 0 and 100
  missing_skills: string[]; // Critical skills mentioned in Job Description but missing from Resume
  recommended_skills: string[]; // Nice-to-have or related skills that would strengthen the profile for this role
  resume_improvements: ResumeImprovementItem[]; // Specific bullet point rewrites tailored to this Job Description
}

interface InterviewPrepItem {
  question: string; // Personalized interview question
  type: 'technical' | 'behavioral' | 'hr';
  suggested_answer: string; // Bullet-proof suggested answer template
  follow_up_question: string; // Highly likely follow-up question
}

interface ImprovementTip {
  category: string; // e.g. "Action Verbs", "Quantification", "Formatting"
  description: string;
}

interface ResumeAnalysisResult {
  ats_score: number; // Overall ATS optimization score (0-100)
  ats_explanation: string; // Markdown formatted explanation of why the score was given
  strengths: string[]; // List of major professional strengths found in the resume
  weaknesses: string[]; // List of areas where the resume is lacking
  missing_keywords: string[]; // Standard keywords/buzzwords relevant to the industry that are missing
  grammar_issues: string[]; // Highlight any typos, grammar mistakes, or passive voice usage
  formatting_suggestions: string[]; // Visual layout, typography, or styling suggestions
  categorized_skills: Skill[]; // Skills parsed from the resume categorized by function
  job_match: JobMatchInfo | null; // NULL if no Job Description is provided, otherwise full match analysis
  interview_prep: InterviewPrepItem[]; // Exactly 10 questions: 5 technical, 5 behavioral/HR
  cover_letter: string; // Tailored cover letter in Markdown format (use the Job Description if provided, or generate a compelling general cover letter based on their profile)
  resume_summary: string; // A clean, professional 2-3 sentence executive summary of the candidate
  improvement_tips: ImprovementTip[]; // List of general actionable tips
}
\`\`\`

Strict Guidelines:
1. Ensure the JSON is completely valid and parseable. Do not wrap the JSON in code blocks in your raw response (just output the JSON string itself).
2. For \`ats_score\`, be realistic. A perfect 100 should be extremely rare. Provide constructive grading.
3. For \`resume_improvements\`, provide concrete, side-by-side rewrites. Make sure the improved versions follow the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).
4. If Job Description is not provided, set \`job_match\` to null. If it IS provided, perform a rigorous gap analysis to calculate \`match_percentage\` and list \`missing_skills\` correctly.
5. In the \`cover_letter\`, write a high-converting, professional cover letter. Avoid templates like "[Insert Name]". Populate all fields with the candidate's actual details parsed from the resume, or sensible defaults based on their profile (e.g. if their contact info is missing, write "Contact details in Resume").
6. The 10 interview questions in \`interview_prep\` must be highly customized. Don't return generic questions like "What is React?". Ask questions based directly on the candidate's projects, experience, and the job description.
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const text = result.response.text();

    let parsedData;

    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.error("Gemini Response:", text);
      throw new Error("Gemini returned invalid JSON.");
    }

    return parsedData;
  } catch (error) {
    console.error('Error invoking Gemini:', error);
    throw new Error('Gemini API failed to process the request. Please check your API key and try again.');
  }
}
