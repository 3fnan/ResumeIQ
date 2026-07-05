export interface Skill {
  name: string;
  category: string; // e.g., 'Frontend', 'Backend', 'DevOps', 'Soft Skills', 'Languages', etc.
}

export interface ResumeImprovementItem {
  original: string;
  improved: string;
  rationale: string;
}

export interface JobMatchInfo {
  match_percentage: number;
  missing_skills: string[];
  recommended_skills: string[];
  resume_improvements: ResumeImprovementItem[];
}

export interface InterviewPrepItem {
  question: string;
  type: 'technical' | 'behavioral' | 'hr';
  suggested_answer: string;
  follow_up_question: string;
}

export interface ImprovementTip {
  category: string; // e.g., 'Action Verbs', 'Quantifying Impact', 'Formatting'
  description: string;
}

export interface ResumeAnalysisResult {
  ats_score: number;
  ats_explanation: string;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  grammar_issues: string[];
  formatting_suggestions: string[];
  categorized_skills: Skill[];
  job_match: JobMatchInfo | null;
  interview_prep: InterviewPrepItem[];
  cover_letter: string; // Tailored cover letter markdown
  resume_summary: string;
  improvement_tips: ImprovementTip[];
}
