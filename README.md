# ResumeIQ AI 🚀

ResumeIQ AI is a production-ready, AI-powered Resume Analyzer and Interview Preparation platform designed for students, job seekers, and career changers. Built using **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and the **Google Gemini API**, it provides instant ATS evaluation, role-specific gap matching, personalized mock interviews, and high-impact cover letter generation.

---

## 🎨 Features
1. **Resume Text Extraction**: Client-to-server PDF upload processing utilizing `pdf-parse`.
2. **ATS Scoring & Feedback**: Detailed compliance grading (/100), listing grammatical flags, layout critiques, strengths, weaknesses, and missing industry keywords.
3. **Target Job Match**: Allows pasting any target job description. The AI does a gap analysis list of missing core skills, recommended tools, and tailored resume bullet point rewrite options.
4. **10 Personalized Interview Questions**: Instantly formulates 5 technical and 5 HR/behavioral questions derived from the user's specific experience and target job. Each question includes high-converting templates for answers and follow-ups.
5. **Cover Letter Generator**: Drafts a highly tailored cover letter in markdown, filling in parsed candidate details and mapping accomplishments to the job duties.
6. **Report Exporting**: Native print styles configured to clean pages for high-fidelity PDF output, alongside quick copy and download triggers for text outputs.
7. **Premium Responsive Theme**: Material-inspired responsive interface with animated dark/light toggle and dynamic circular loaders.

---

## 📂 Project Structure
```text
GoogleBootcamp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts         # Server-side API handler coordinating Gemini & PDF parses
│   │   ├── layout.tsx               # Next.js App Router Root Layout
│   │   ├── page.tsx                 # Main entry page coordinating state machines
│   │   └── globals.css              # Global styles (Tailwind CSS configuration & custom classes)
│   ├── components/
│   │   ├── Hero.tsx                 # visual landing hero section
│   │   ├── Navbar.tsx               # Header nav with theme switch triggers
│   │   ├── ResumeUpload.tsx         # Drag-and-drop PDF upload form & loading screen
│   │   ├── Dashboard.tsx            # Main visual dashboard container with analysis tabs
│   │   └── ui/
│   │       ├── Button.tsx           # Custom button UI
│   │       ├── Card.tsx             # Card UI wrappers
│   │       ├── Progress.tsx         # Color-coded progress bar
│   │       └── Tabs.tsx             # Context-backed tab navigation
│   ├── types/
│   │   └── index.ts                 # Clean TypeScript structures
│   └── utils/
│       ├── gemini.ts                # Gemini API SDK Client and Prompt Engineering logic
│       └── pdf.ts                   # pdf-parse server-side text extraction helper
├── tests/
│   └── resume-analyzer.spec.js      # Playwright end-to-end integration tests
├── .env.example                     # Environment template file
├── .env.local                       # Local API key storage (Excluded from VCS)
├── eslint.config.mjs                # ESLint configuration
├── next.config.ts                   # Next.js framework configuration
├── package.json                     # Node script listings and dependencies
├── playwright.config.js             # Playwright testing suite configuration
├── tsconfig.json                    # TypeScript compiler preferences
└── README.md                        # Documentation and guides
```

---

## 🛠️ Setup & Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24.13.1 used in development)
- **NPM**: v9.0.0 or higher

### 2. Installation
Install all dependencies and browser engines required for Playwright:
```cmd
# Install node packages
npm install

# Install Playwright browser dependencies
npx playwright install
```

### 3. Environment Variable
Create a `.env.local` file in the root directory (already populated as a template) and add your Google Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
```
> [!TIP]
> You can acquire a Gemini API Key for free from [Google AI Studio](https://aistudio.google.com/).

### 4. Running the Dev Server
Launch the local Next.js development server:
```cmd
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 Testing with Playwright
To run E2E integration tests simulating uploads, dashboard visualizations, tab navigation, and reset mechanics:

```cmd
# Run E2E tests headlessly
npx playwright test
```

---

## 🚀 Deployment Guide
You can deploy ResumeIQ AI easily to production hosts supporting server-side Node.js environments (Next.js SSR/API routes):

### Deploying to Vercel (Recommended)
1. Install the [Vercel CLI](https://vercel.com/cli) or hook your GitHub repository to Vercel.
2. Ensure you add `GEMINI_API_KEY` under **Environment Variables** in your Vercel Project Settings.
3. Vercel automatically detects Next.js configurations. Click **Deploy**.

### Deploying to Netlify
1. Connect your repository to Netlify.
2. Select `Next.js` as the project preset.
3. Configure `GEMINI_API_KEY` in Netlify's **Site configuration** -> **Environment variables**.
4. Click **Deploy Site**.
