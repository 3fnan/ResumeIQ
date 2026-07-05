'use client';

import React, { useState } from 'react';
import Hero from '@/components/Hero';
import ResumeUpload from '@/components/ResumeUpload';
import Dashboard from '@/components/Dashboard';
import { ResumeAnalysisResult } from '@/types';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartClick = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to analyze resume. Please try again.');
      }

      const result: ResumeAnalysisResult = await response.json();
      setAnalysisResult(result);
      
      // Scroll to dashboard top smoothly after state updates
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred while communicating with the AI service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {analysisResult ? (
        <Dashboard data={analysisResult} onReset={handleReset} />
      ) : (
        <div className="space-y-4">
          <Hero onStartClick={handleStartClick} />
          
          <div className="container mx-auto px-4 max-w-4xl">
            {error && (
              <div className="flex items-center space-x-2.5 p-4 border border-danger/30 bg-danger-bg rounded-xl text-danger text-sm shadow-sm mx-auto">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <ResumeUpload onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
