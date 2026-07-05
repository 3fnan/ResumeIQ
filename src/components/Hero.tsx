'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Cpu, FileText, Sparkles, Trophy } from 'lucide-react';
import { Button } from './ui/Button';

interface HeroProps {
  onStartClick: () => void;
}

export default function Hero({ onStartClick }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-background via-background to-secondary/30 border-b border-border/50 no-print">
      {/* Background blobs for a beautiful dark/light background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-primary-hover/5 border border-primary/20 text-xs font-semibold text-primary mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span></span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6 text-foreground"
          >
            Win Your Next Interview with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-accent">
              ResumeIQ AI
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground font-normal max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Upload your resume, paste a target job description, and receive a comprehensive,
            recruiter-grade ATS analysis, tailored cover letter, and personalized interview preparation questions instantly.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <Button size="lg" className="w-full sm:w-auto shadow-lg" onClick={onStartClick}>
              Start Free Analysis
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <a href="#features" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </a>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-5xl mx-auto border-t border-border pt-12"
          >
            <div className="flex space-x-3">
              <div className="bg-primary/10 text-primary p-2.5 h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">ATS Optimization</h4>
                <p className="text-xs text-muted-foreground">Detailed scan for keywords & score check</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <div className="bg-primary/10 text-primary p-2.5 h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Skills Matcher</h4>
                <p className="text-xs text-muted-foreground">Identify gaps against job descriptions</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <div className="bg-primary/10 text-primary p-2.5 h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Interview Ready</h4>
                <p className="text-xs text-muted-foreground">10 personalized Q&As with suggestions</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <div className="bg-primary/10 text-primary p-2.5 h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Cover Letter</h4>
                <p className="text-xs text-muted-foreground">High-converting markdown editor letter</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
