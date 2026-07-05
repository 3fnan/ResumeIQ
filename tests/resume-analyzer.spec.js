const { test, expect } = require('@playwright/test');

test.describe('ResumeIQ AI Integration Tests', () => {
  test('should render landing page elements correctly', async ({ page }) => {
    await page.goto('/');

    // Check main title branding
    await expect(page.locator('text=ResumeIQ').first()).toBeVisible();
    await expect(page.locator('text=AI').first()).toBeVisible();
    await expect(page.locator('h1')).toContainText('Win Your Next Interview with');

    // Check upload elements
    await expect(page.locator('text=Analyze Your Resume')).toBeVisible();
    await expect(page.locator('text=Drag and drop resume here')).toBeVisible();
    await expect(page.locator('label:has-text("Job Description")')).toBeVisible();
  });

  test('should complete end-to-end resume analysis with mock responses', async ({ page }) => {
    // Mock Next.js POST request to /api/analyze
    await page.route('**/api/analyze', async (route) => {
      const mockPayload = {
        ats_score: 87,
        ats_explanation: 'Your resume features robust industry alignment. Formatting and syntax score high.',
        strengths: [
          'Excellent use of active metrics and XYZ structures.',
          'Comprehensive frontend stack profiling (React, Tailwind CSS).',
        ],
        weaknesses: [
          'Limited Devops and deployment exposure.',
          'Missing professional cert section.',
        ],
        missing_keywords: ['Docker', 'AWS ECS', 'CI/CD'],
        grammar_issues: ['Passive structure in job 2 bullets.'],
        formatting_suggestions: ['Margins could be compressed to 0.75in.'],
        categorized_skills: [
          { name: 'React', category: 'Frontend' },
          { name: 'TypeScript', category: 'Languages' },
          { name: 'Tailwind CSS', category: 'CSS Frameworks' },
          { name: 'Node.js', category: 'Backend' },
        ],
        job_match: {
          match_percentage: 84,
          missing_skills: ['Docker', 'CI/CD'],
          recommended_skills: ['GraphQL', 'Kubernetes'],
          resume_improvements: [
            {
              original: 'Built website features using React.',
              improved: 'Architected 15+ responsive components in Next.js, boosting lighthouse ratings by 24%.',
              rationale: 'Includes quantifiable metrics and target tech terminology.',
            },
          ],
        },
        interview_prep: [
          {
            question: 'Explain how you optimized Next.js performance.',
            type: 'technical',
            suggested_answer: 'Used image optimization, font caching, and dynamic route loading.',
            follow_up_question: 'How does layout shift affect rendering scores?',
          },
          {
            question: 'Describe a conflict resolution scenario with teammates.',
            type: 'hr',
            suggested_answer: 'Emphasize structured communication, design docs, and align on project goals.',
            follow_up_question: 'How did you handle the eventual feedback?',
          },
        ],
        cover_letter: '# Application Cover Letter\n\nDear Hiring Representative,\n\nI am writing to express my eager candidacy...',
        resume_summary: 'Energetic fullstack builder with 3+ years experience designing React and Node apps.',
        improvement_tips: [
          {
            category: 'Action Verbs',
            description: 'Begin experience bullets with words like Designed, Spearheaded, or Engineered.',
          },
        ],
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPayload),
      });
    });

    await page.goto('/');

    // Input file simulation
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('text=click to select file').click();
    const fileChooser = await fileChooserPromise;

    // Use a dummy buffer to simulate PDF uploads
    await fileChooser.setFiles({
      name: 'my_resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4...'),
    });

    // Paste sample job text
    await page.fill(
      'textarea[placeholder*="Paste the target job description"]',
      'Wanted: React developer with Docker and CI/CD skills.'
    );

    // Trigger analysis submit
    await page.click('button:has-text("Start Analysis")');

    // Verify Dashboard loading transition and final states
    await expect(page.locator('text=Analysis Report')).toBeVisible();
    await expect(page.locator('text=87')).toBeVisible(); // Check ATS score displays
    await expect(page.locator('text=84%')).toBeVisible(); // Check Job Match percentage displays

    // Tab Navigation tests
    await page.click('button:has-text("ATS Insights")');
    await expect(page.locator('text=Strengths')).toBeVisible();
    await expect(page.locator('text=Docker')).toBeVisible(); // Keyword displays

    await page.click('button:has-text("Skills Matrix")');
    await expect(page.locator('text=CSS Frameworks')).toBeVisible();
    await expect(page.locator('text=Tailwind CSS')).toBeVisible();

    await page.click('button:has-text("Job Match")');
    await expect(page.locator('text=Role-Specific Enhancements')).toBeVisible();

    // Reset flow
    await page.click('button:has-text("Analyze Another")');
    await expect(page.locator('text=Analyze Your Resume')).toBeVisible();
  });
});
