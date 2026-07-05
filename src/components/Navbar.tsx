'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Brain } from 'lucide-react';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md no-print">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2.5">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg flex items-center justify-center shadow-md">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent dark:to-primary">
              ResumeIQ
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1.5 px-1.5 py-0.5 rounded-full bg-secondary border border-border">
              AI
            </span>
          </div>
        </div>

        {/* Action Button & Theme Selector */}
        <div className="flex items-center space-x-4">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent hover:border-border transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 animate-pulse" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
