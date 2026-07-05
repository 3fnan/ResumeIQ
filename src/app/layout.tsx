import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'ResumeIQ AI - AI-Powered Resume Analyzer & Interview Prep',
  description:
    'ResumeIQ is a premium, Google Gemini-powered resume analysis and mock interview preparation platform. Analyze your ATS score, discover missing keywords, practice tailored Q&As, and generate high-impact cover letters.',
  keywords: [
    'Resume Analyzer',
    'AI Resume Review',
    'ATS Score Checker',
    'Interview Prep AI',
    'Cover Letter Generator',
    'Career Coach AI',
  ],
  authors: [{ name: 'ResumeIQ Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <Navbar />
        <main className="flex-1">{children}</main>

        {/* Footer (Visible in browser, hidden in print) */}
        <footer className="py-8 border-t border-border bg-secondary/20 text-center text-xs text-muted-foreground no-print mt-auto">
          <div className="container mx-auto px-4">
            <p className="mb-2">© {new Date().getFullYear()} ResumeIQ AI. All rights reserved.</p>
            <p>Built by Afnan Abdul Rahiman</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
