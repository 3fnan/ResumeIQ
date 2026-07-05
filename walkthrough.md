# Project Walkthrough - ResumeIQ AI

This document summarizes the changes, codebase architecture, and verification results for **ResumeIQ AI**, a premium AI-powered Resume Analyzer and Interview Preparation platform.

---

## 🛠️ Created File Structure

All project files have been built inside `c:\Users\AFNAN\Desktop\GoogleBootcamp`:

- **Configuration Files**:
  - `package.json`: Contains workspace dependencies, script bindings (development, compilation, tests).
  - `tsconfig.json`: Controls TypeScript compilation targets and root directories.
  - `.env.example` & `.env.local`: Guides setting up the `GEMINI_API_KEY`.
  - `playwright.config.js`: Automated config to boot the server and test routes.

- **Utilities & Types**:
  - `src/types/index.ts`: TypeScript specifications for API JSON schemas and component props.
  - `src/utils/pdf.ts`: Converts uploaded binary buffers into text utilizing `pdf-parse`.
  - `src/utils/gemini.ts`: Integrates with the `@google/generative-ai` SDK, feeds strict JSON prompt structures to `gemini-2.5-flash`.

- **Next.js Routing & Layouts**:
  - `src/app/api/analyze/route.ts`: API route coordinates file uploads, parsing, and Gemini SDK integration.
  - `src/app/layout.tsx`: Integrates branding header navbar, viewport configuration, and custom dark theme triggers.
  - `src/app/globals.css`: Setup Tailwind CSS variables for Light/Dark Material themes, typography, custom scrollbars, and print layouts.
  - `src/app/page.tsx`: Manages React states (upload inputs, loader indicators, dashboard results).

- **Component Tree**:
  - `src/components/Navbar.tsx`: Header brand detailing and theme switchers.
  - `src/components/Hero.tsx`: Dynamic introduction showcasing benefits.
  - `src/components/ResumeUpload.tsx`: File upload interface with drag-and-drop validation and cyclical loading copy.
  - `src/components/Dashboard.tsx`: Interactive core displaying gauges, custom questions, bullet adjustments, cover letter editors, and export actions.
  - `src/components/ui/`: Contains custom, reusable styles for `Button`, `Card`, `Progress`, and `Tabs`.

---

## 🧪 E2E Verification Results

We configured and executed Playwright tests across multiple browsers (Chromium & Firefox) headlessly:

- **Command executed**: `npm run test`
- **Output**:
```text
Running 4 tests using 4 workers

  ok [chromium] › tests\resume-analyzer.spec.js:4:3 › ResumeIQ AI Integration Tests › should render landing page elements correctly (1.3s)
  ok [chromium] › tests\resume-analyzer.spec.js:18:3 › ResumeIQ AI Integration Tests › should complete end-to-end resume analysis with mock responses (1.9s)
  ok [firefox] › tests\resume-analyzer.spec.js:4:3 › ResumeIQ AI Integration Tests › should render landing page elements correctly (2.2s)
  ok [firefox] › tests\resume-analyzer.spec.js:3:18 › ResumeIQ AI Integration Tests › should complete end-to-end resume analysis with mock responses (2.6s)

  4 passed (12.5s)
```

Tests successfully verified:
1. Brand header rendering and dark theme controls.
2. File picker inputs validating PDF constraints.
3. Form parsing, POST payload structure, and loader visualizations.
4. Correct tab navigation rendering, copy triggers, and state resets.

---

## 🚀 Step-by-Step Validation Guide

Follow these steps to run the application locally:

1. **Prerequisites Check**:
   Ensure Node.js and NPM are installed on your command line:
   ```cmd
   node -v
   npm -v
   ```

2. **Add API Key**:
   Open the file `.env.local` inside the project root and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
   *(You can obtain a free key instantly from [Google AI Studio](https://aistudio.google.com/))*

3. **Start local Server**:
   Start the Next.js dev server:
   ```cmd
   npm run dev
   ```
   Open your browser to [http://localhost:3000](http://localhost:3000) to view the live dashboard.

4. **Verify E2E Suite**:
   Execute the automated E2E tests in Command Prompt:
   ```cmd
   npm run test
   ```
