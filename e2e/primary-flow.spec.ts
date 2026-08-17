import { test, expect } from '@playwright/test';

test.describe('Primary User Flow E2E Walkthrough', () => {
  test('navigates portfolio, opens lead case study, and verifies modal interaction', async ({ page }) => {
    // 1. Visit portfolio homepage
    await page.goto('/');

    // 2. Verify page title and header branding
    await expect(page).toHaveTitle(/Srikant \| AI Engineer & Capstone Practitioner/i);
    const logoLink = page.getByRole('link', { name: /srikant flyrank ai capstone/i });
    await expect(logoLink).toBeVisible();

    // 3. Verify lead case study exists (ResearchScout AI Agent)
    const leadProjectTitle = page.getByRole('heading', { name: /ResearchScout AI Agent/i });
    await expect(leadProjectTitle).toBeVisible();

    // 4. Test opening the meeting modal
    const connectButton = page.getByRole('button', { name: /connect/i });
    await connectButton.click();

    // 5. Verify modal dialog appears
    const modalHeading = page.getByRole('heading', { name: /schedule a technical chat/i });
    await expect(modalHeading).toBeVisible();

    // 6. Close modal by clicking close button
    const closeBtn = page.getByRole('button', { name: /×/i });
    await closeBtn.click();
    await expect(modalHeading).not.toBeVisible();
  });
});
