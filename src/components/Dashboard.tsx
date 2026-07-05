'use client';

import React, { useState } from 'react';
import { 
  Award, Briefcase, CheckCircle2, Clipboard, FileText, 
  HelpCircle, MessageSquare, AlertTriangle, RefreshCw, 
  BookOpen, Star, Sparkles, Download, Printer 
} from 'lucide-react';
import { ResumeAnalysisResult, InterviewPrepItem, ResumeImprovementItem } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';

interface DashboardProps {
  data: ResumeAnalysisResult;
  onReset: () => void;
}

export default function Dashboard({ data, onReset }: DashboardProps) {
  const [copied, setCopied] = useState(false);
  const [interviewFilter, setInterviewFilter] = useState<'all' | 'technical' | 'hr'>('all');
  const [coverLetterText, setCoverLetterText] = useState(data.cover_letter);

  // Copy cover letter utility
  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export cover letter text
  const downloadCoverLetter = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetterText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "cover_letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Export interview prep questions
  const downloadInterviewPrep = () => {
    let content = "RESUMEIQ AI - PERSONALIZED INTERVIEW PREPARATION\n\n";
    data.interview_prep.forEach((item, index) => {
      content += `Question ${index + 1} [${item.type.toUpperCase()}]: ${item.question}\n`;
      content += `Suggested Answer: ${item.suggested_answer}\n`;
      content += `Follow-up Question: ${item.follow_up_question}\n\n`;
    });
    
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "interview_questions.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Print PDF using standard browser printing
  const handlePrint = () => {
    window.print();
  };

  // Filtered Interview Questions
  const filteredQuestions = data.interview_prep.filter(q => {
    if (interviewFilter === 'all') return true;
    if (interviewFilter === 'technical') return q.type === 'technical';
    return q.type === 'behavioral' || q.type === 'hr';
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      {/* Dashboard Top Header (Visible in browser, hidden in print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 no-print border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
            Analysis Report <Sparkles className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Review detailed insights, keywords, skills match, and practice mock questions.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onReset} className="cursor-pointer">
            <RefreshCw className="mr-2 h-4 w-4" />
            Analyze Another
          </Button>
          <Button variant="primary" onClick={handlePrint} className="cursor-pointer">
            <Printer className="mr-2 h-4 w-4" />
            Print Report (PDF)
          </Button>
        </div>
      </div>

      {/* DASHBOARD GRID SYSTEM */}
      <Tabs defaultValue="overview" className="space-y-6">
        {/* Navigation list (Hidden in print) */}
        <div className="no-print overflow-x-auto pb-1.5">
          <TabsList className="flex min-w-max">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ats">ATS Insights</TabsTrigger>
            <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
            {data.job_match && <TabsTrigger value="match">Job Match</TabsTrigger>}
            <TabsTrigger value="improvements">Resume Improvements</TabsTrigger>
            <TabsTrigger value="interview">Interview Prep</TabsTrigger>
            <TabsTrigger value="letter">Cover Letter</TabsTrigger>
          </TabsList>
        </div>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ATS Score card */}
            <Card className="md:col-span-1 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  ATS Score
                </CardTitle>
                <CardDescription>Overall compliance rating</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                {/* SVG Radial Progress Gauge */}
                <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-muted"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className={`transition-all duration-1000 ease-out ${
                        data.ats_score >= 80 ? 'stroke-success' : data.ats_score >= 60 ? 'stroke-warning' : 'stroke-danger'
                      }`}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 * (1 - data.ats_score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-4xl font-extrabold text-foreground">{data.ats_score}</span>
                    <span className="text-sm text-muted-foreground block">/ 100</span>
                  </div>
                </div>
                <div className="text-center w-full">
                  <span className="text-sm font-semibold inline-block px-3 py-1 rounded-full border bg-secondary mb-3">
                    {data.ats_score >= 80 ? 'Ready to Apply' : data.ats_score >= 60 ? 'Needs Improvement' : 'High Risk'}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed px-4">
                    Based on keyword density, visual structure, formatting, and grammar flags.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Resume Summary Card */}
            <Card className="md:col-span-2 border-primary/10 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Executive Summary
                </CardTitle>
                <CardDescription>AI-generated professional profile overview</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-foreground/90 text-base leading-relaxed italic bg-secondary/30 p-5 rounded-xl border border-border/50">
                  "{data.resume_summary}"
                </p>
                
                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 border-t border-border pt-6">
                  <div>
                    <span className="text-2xl font-bold text-foreground">{data.categorized_skills.length}</span>
                    <span className="text-xs text-muted-foreground block">Identified Skills</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-foreground">{data.grammar_issues.length}</span>
                    <span className="text-xs text-muted-foreground block">Grammar Flags</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-foreground">{data.interview_prep.length}</span>
                    <span className="text-xs text-muted-foreground block">Mock Questions</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-foreground">{data.job_match ? `${data.job_match.match_percentage}%` : 'N/A'}</span>
                    <span className="text-xs text-muted-foreground block">Job Match Score</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Recommendations & Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  ATS Score Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed">
                {data.ats_explanation}
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Key General Action Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {data.improvement_tips.slice(0, 4).map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm">
                      <div className="bg-primary/10 text-primary px-2.5 py-1 rounded font-semibold text-xs shrink-0 mt-0.5">
                        {tip.category}
                      </div>
                      <p className="text-foreground/90 leading-relaxed">{tip.description}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. ATS INSIGHTS TAB */}
        <TabsContent value="ats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths & Weaknesses */}
            <Card className="border-border">
              <CardHeader className="bg-success-bg border-b border-border/10">
                <CardTitle className="text-success text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3.5">
                  {data.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-sm text-foreground/90 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="bg-danger-bg border-b border-border/10">
                <CardTitle className="text-danger text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3.5">
                  {data.weaknesses.map((weak, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-sm text-foreground/90 leading-relaxed">
                      <AlertTriangle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Missing Keywords */}
            <Card className="border-border md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Missing Keywords</CardTitle>
                <CardDescription>Industry buzzwords to incorporate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.missing_keywords.length > 0 ? (
                    data.missing_keywords.map((word, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border bg-warning-bg border-warning/20 text-warning"
                      >
                        {word}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None identified! Excellent coverage.</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Grammar & Language Issues */}
            <Card className="border-border md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Language & Grammar</CardTitle>
                <CardDescription>Grammar flags or active voice issues</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {data.grammar_issues.length > 0 ? (
                    data.grammar_issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-foreground/90 leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        <span>{issue}</span>
                      </li>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No grammar flags found. Clean styling.</span>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Formatting suggestions */}
            <Card className="border-border md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Formatting & Layout</CardTitle>
                <CardDescription>Suggestions to improve structural design</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {data.formatting_suggestions.length > 0 ? (
                    data.formatting_suggestions.map((sug, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-foreground/90 leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{sug}</span>
                      </li>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Excellent layout formatting!</span>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. SKILLS MATRIX TAB */}
        <TabsContent value="skills">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Categorized Skills Matrix
              </CardTitle>
              <CardDescription>
                We found these technical and soft skills parsed from your experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Group skills by category */}
              {(() => {
                const groups: Record<string, string[]> = {};
                data.categorized_skills.forEach(s => {
                  if (!groups[s.category]) {
                    groups[s.category] = [];
                  }
                  groups[s.category].push(s.name);
                });

                const categories = Object.keys(groups);
                if (categories.length === 0) {
                  return <p className="text-muted-foreground text-sm">No skills identified in the resume text.</p>;
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="p-5 rounded-xl border border-border bg-secondary/15 flex flex-col space-y-3.5">
                        <h4 className="font-bold text-foreground text-sm border-b border-border pb-2 capitalize tracking-wide flex items-center justify-between">
                          <span>{cat}</span>
                          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {groups[cat].length}
                          </span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {groups[cat].map((skillName, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 text-xs rounded-md bg-card text-foreground border border-border font-medium shadow-sm"
                            >
                              {skillName}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. JOB MATCH TAB (Optional, only visible if job description paste is provided) */}
        {data.job_match && (
          <TabsContent value="match">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Match Gauge */}
              <Card className="md:col-span-1 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Match Score
                  </CardTitle>
                  <CardDescription>Target job matching analysis</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="60" className="stroke-muted" strokeWidth="10" fill="transparent" />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-primary transition-all duration-1000 ease-out"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 60}
                        strokeDashoffset={2 * Math.PI * 60 * (1 - data.job_match.match_percentage / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-4xl font-extrabold text-foreground">
                        {data.job_match.match_percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full text-center">
                    <span className="text-sm font-semibold inline-block px-3.5 py-1 rounded-full border bg-secondary mb-3">
                      {data.job_match.match_percentage >= 80 ? 'Strong Match' : data.job_match.match_percentage >= 60 ? 'Fair Match' : 'Weak Match'}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed px-4">
                      Based on keyword overlap, role alignment, and missing critical skill tags.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Missing Skills vs Recommended Skills */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base text-danger flex items-center gap-2">
                      <AlertTriangle className="h-4.5 w-4.5" />
                      Missing Core Skills
                    </CardTitle>
                    <CardDescription>Required but missing from resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {data.job_match.missing_skills.length > 0 ? (
                        data.job_match.missing_skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md border bg-danger-bg border-danger/10 text-danger"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">All core skills are satisfied!</span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base text-primary flex items-center gap-2">
                      <Star className="h-4.5 w-4.5" />
                      Recommended Skills
                    </CardTitle>
                    <CardDescription>To strengthen your application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {data.job_match.recommended_skills.length > 0 ? (
                        data.job_match.recommended_skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md border bg-secondary text-foreground"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">None identified.</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Improvements tailored for Job Description */}
            {data.job_match.resume_improvements.length > 0 && (
              <Card className="border-border mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Role-Specific Enhancements</CardTitle>
                  <CardDescription>
                    Rewrite recommendations to optimize matching against this specific Job Description.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data.job_match.resume_improvements.map((item, idx) => (
                      <div key={idx} className="p-5 border border-border bg-secondary/10 rounded-xl space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-card border border-border rounded-lg">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                              Original Bullet
                            </span>
                            <p className="text-sm text-foreground/80 leading-relaxed italic">"{item.original}"</p>
                          </div>
                          <div className="p-3 bg-success-bg/10 border border-success/20 rounded-lg">
                            <span className="text-xs font-semibold text-success uppercase tracking-wider block mb-1">
                              Improved Rewrite
                            </span>
                            <p className="text-sm text-foreground font-semibold leading-relaxed">"{item.improved}"</p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong className="text-foreground">Recruiter Rationale:</strong> {item.rationale}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {/* 5. RESUME IMPROVEMENTS TAB */}
        <TabsContent value="improvements">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Resume Enhancements & Actionable Rewrites
              </CardTitle>
              <CardDescription>
                Replace passive sentences with high-impact action verbs and metric structures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* General rewrites generator (either from job description or standard) */}
                {data.job_match && data.job_match.resume_improvements.length > 0 ? (
                  data.job_match.resume_improvements.map((item, idx) => (
                    <ImprovementBlock key={idx} item={item} index={idx} />
                  ))
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      No specific rewrites listed. Here are structural advice categories:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.improvement_tips.map((tip, idx) => (
                        <div key={idx} className="p-4 border rounded-xl bg-secondary/20">
                          <h4 className="font-bold text-sm text-foreground mb-1">{tip.category}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. INTERVIEW PREP TAB */}
        <TabsContent value="interview">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 no-print">
            <div>
              <h3 className="text-lg font-bold text-foreground">10 Customized Mock Questions</h3>
              <p className="text-xs text-muted-foreground">
                Tailored interview preparation formulated from your resume background.
              </p>
            </div>
            {/* Filter buttons */}
            <div className="flex bg-secondary p-1 border rounded-lg max-w-max text-xs font-semibold">
              <button
                onClick={() => setInterviewFilter('all')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 ${
                  interviewFilter === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                All (10)
              </button>
              <button
                onClick={() => setInterviewFilter('technical')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 ${
                  interviewFilter === 'technical' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Technical
              </button>
              <button
                onClick={() => setInterviewFilter('hr')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 ${
                  interviewFilter === 'hr' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                HR & Behavioral
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((prep, idx) => (
              <InterviewQuestionCard key={idx} item={prep} index={idx} />
            ))}
          </div>

          <div className="flex justify-center mt-6 no-print">
            <Button variant="outline" onClick={downloadInterviewPrep} className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              Download Q&A Guide
            </Button>
          </div>
        </TabsContent>

        {/* 7. COVER LETTER TAB */}
        <TabsContent value="letter">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between no-print border-b border-border/50">
                  <div>
                    <CardTitle className="text-base">Tailored Cover Letter</CardTitle>
                    <CardDescription>Edit & personalize details inline before exporting</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={handleCopyCoverLetter} className="cursor-pointer">
                      <Clipboard className="mr-1.5 h-3.5 w-3.5" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCoverLetter} className="cursor-pointer">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <textarea
                    className="w-full min-h-[480px] p-6 text-sm text-foreground bg-transparent font-mono focus:outline-none resize-y border-none"
                    value={coverLetterText}
                    onChange={(e) => setCoverLetterText(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Recruiter guidelines sidebar */}
            <div className="lg:col-span-1 space-y-6 no-print">
              <Card className="border-border bg-secondary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <MessageSquare className="h-4.5 w-4.5 text-primary" />
                    Cover Letter Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-3.5">
                  <p>
                    Your cover letter has been structured to address matching skills, role qualifications,
                    and experiences extracted from your resume.
                  </p>
                  <div className="space-y-2 border-t border-border pt-3">
                    <span className="font-semibold text-foreground block">Key suggestions:</span>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Verify dates, contact info, and company name references.</li>
                      <li>Adjust the tone if the company culture is very casual.</li>
                      <li>Avoid generic buzzwords; highlight concrete outcomes.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Side-by-side Enhancement Component helper
function ImprovementBlock({ item, index }: { item: ResumeImprovementItem; index: number }) {
  return (
    <div className="p-5 border border-border bg-secondary/10 rounded-xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-card border border-border rounded-lg">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Original Resume Text
          </span>
          <p className="text-sm text-foreground/80 leading-relaxed italic">"{item.original}"</p>
        </div>
        <div className="p-3 bg-success-bg/15 border border-success/30 rounded-lg">
          <span className="text-xs font-semibold text-success uppercase tracking-wider block mb-1">
            Improved Version
          </span>
          <p className="text-sm text-foreground font-semibold leading-relaxed">"{item.improved}"</p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
        <strong className="text-foreground">Coach Explanation:</strong> {item.rationale}
      </div>
    </div>
  );
}

// Expandable Mock Question Card
function InterviewQuestionCard({ item, index }: { item: InterviewPrepItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border border-border/80 transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-start space-x-3.5">
          <div className="mt-0.5 shrink-0 bg-primary/10 text-primary p-2 h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs">
            Q{index + 1}
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm leading-snug md:text-base">
              {item.question}
            </h4>
            <div className="flex items-center space-x-2 mt-1.5 text-xs">
              <span className={`px-2 py-0.5 rounded-full font-semibold border ${
                item.type === 'technical' 
                  ? 'bg-primary-hover/5 border-primary/20 text-primary' 
                  : 'bg-accent/5 border-accent/20 text-accent'
              } capitalize`}>
                {item.type}
              </span>
            </div>
          </div>
        </div>
        <span className="text-muted-foreground font-bold text-xl ml-4 select-none shrink-0">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <CardContent className="border-t border-border bg-secondary/10 p-5 space-y-4 animate-slide-up">
          <div className="bg-card border border-border p-4.5 rounded-xl">
            <span className="text-xs font-bold text-success uppercase tracking-wider block mb-1">
              Suggested Answer Template
            </span>
            <p className="text-sm text-foreground/90 leading-relaxed font-sans whitespace-pre-line">
              {item.suggested_answer}
            </p>
          </div>
          {item.follow_up_question && (
            <div className="bg-card border border-border/60 p-4.5 rounded-xl">
              <span className="text-xs font-semibold text-warning uppercase tracking-wider block mb-1 flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" /> Likely Follow-Up Question
              </span>
              <p className="text-sm text-foreground/90 font-medium italic">
                "{item.follow_up_question}"
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
