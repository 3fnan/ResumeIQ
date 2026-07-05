'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface ResumeUploadProps {
  onAnalyze: (file: File, jobDescription: string) => Promise<void>;
  isLoading: boolean;
}

const LOADING_STEPS = [
  'Reading PDF bytes...',
  'Extracting resume text content...',
  'Interfacing with Google Gemini API...',
  'Calculating ATS compliance score...',
  'Analyzing skills gaps against industry requirements...',
  'Formulating 10 custom interview prep questions...',
  'Generating personalized cover letter draft...',
  'Finalizing career recommendations report...',
];

export default function ResumeUpload({ onAnalyze, isLoading }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Cycle loading messages when analyzing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const processFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Only PDF files are supported.');
      return;
    }
    // Limit to 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload your resume to start.');
      return;
    }
    onAnalyze(file, jobDescription);
  };

  return (
    <div id="upload-section" className="py-12 bg-background scroll-mt-20 no-print">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
            Analyze Your Resume
          </h2>
          <p className="text-muted-foreground">
            Upload your resume PDF and optionally paste the target job description to match skills.
          </p>
        </div>

        {isLoading ? (
          <Card className="border-primary/20 bg-secondary/10 shadow-lg">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <FileText className="absolute h-6 w-6 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Analyzing Profile</h3>
              <p className="text-muted-foreground max-w-md text-sm animate-pulse">
                {LOADING_STEPS[loadingStep]}
              </p>
              <div className="w-64 bg-muted h-1.5 rounded-full overflow-hidden mt-6">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2.5 p-4 border border-danger/30 bg-danger-bg rounded-lg text-danger text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume Upload Drag Zone */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-foreground mb-2">
                  Resume PDF <span className="text-accent">*</span>
                </label>
                
                {file ? (
                  <Card className="flex-1 border-primary/20 bg-primary-hover/5 flex flex-col items-center justify-center p-8 text-center relative min-h-[220px]">
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-border/40 hover:bg-border/80 text-foreground transition-all duration-200 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                      <FileText className="h-8 w-8" />
                    </div>
                    <span className="font-semibold text-foreground text-sm max-w-[200px] truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </Card>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] transition-all duration-200 ${
                      isDragActive
                        ? 'border-primary bg-primary-hover/5'
                        : 'border-border hover:border-primary/50 bg-card hover:bg-secondary/40'
                    }`}
                  >
                    <input
                      type="file"
                      id="resume-file-input"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="resume-file-input"
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="bg-secondary p-4 rounded-full border border-border mb-4 text-muted-foreground">
                        <Upload className="h-6 w-6" />
                      </div>
                      <span className="font-semibold text-foreground text-sm">
                        Drag and drop resume here
                      </span>
                      <span className="text-xs text-muted-foreground mt-2">
                        or click to select file (PDF only, up to 5MB)
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Job Description Field */}
              <div className="flex flex-col">
                <label htmlFor="job-description-input" className="text-sm font-semibold text-foreground mb-2 flex justify-between">
                  <span>Job Description</span>
                  <span className="text-xs text-muted-foreground font-normal">Optional</span>
                </label>
                <textarea
                  id="job-description-input"
                  className="flex-1 w-full p-4 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background min-h-[220px] resize-none"
                  placeholder="Paste the target job description here to analyze matching score, discover missing skills, and generate custom interview questions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto min-w-[200px]"
                disabled={!file}
              >
                Start Analysis
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
