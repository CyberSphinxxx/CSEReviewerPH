import { test, expect } from "@playwright/test";

test.describe("Civil Service Exam Reviewer E2E Flows", () => {
  test("loads landing page with exam preparation options", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CSE Reviewer PH/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Pass the Philippine Civil Service Exam/i);

    // Verify presence of preparation mode cards
    await expect(page.getByRole("heading", { name: "Quick Test" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Medium Test" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Full Mock Exam" })).toBeVisible();
  });

  test("takes Quick Test, flags a question, submits, and views results", async ({ page }) => {
    await page.goto("/exams/professional/quick");

    // Header and timer visible
    await expect(page.locator("#exam-timer")).toBeVisible();
    await expect(page.getByText(/Question 1 of 10/i)).toBeVisible();

    // Flag question
    const flagBtn = page.locator("#flag-question-button");
    await flagBtn.click();
    await expect(flagBtn).toContainText(/Flagged/i);

    // Select first choice
    const firstChoice = page.locator("button:has(span.rounded-lg:text('A'))").first();
    await firstChoice.click();

    // Navigate to next question
    await page.locator("#next-question-btn").click();
    await expect(page.getByText(/Question 2 of 10/i)).toBeVisible();

    // Open question palette
    await page.getByRole("button", { name: /palette/i }).click();
    await expect(page.getByText(/Question Navigator/i)).toBeVisible();
    // Return from palette
    await page.getByRole("button", { name: /return to exam/i }).click();

    // Open review modal and submit
    await page.getByRole("button", { name: /submit/i }).first().click();
    await expect(page.getByText(/Review Before Submission/i)).toBeVisible();

    // Confirm submission
    await page.locator("#confirm-submit-btn").click();

    // Verify navigation to results
    await page.waitForURL(/\/results\/.+/);
    await expect(page.getByText(/Subtest Performance Breakdown/i)).toBeVisible();
    await expect(page.getByText(/Detailed Answer Review/i)).toBeVisible();
    await expect(page.getByText(/Educational Concept & Rationale/i).first()).toBeVisible();
  });

  test("loads Full Mock Exam with single continuous timer matching 170 items", async ({ page }) => {
    await page.goto("/exams/professional/full");

    await expect(page.getByText(/Full Mock Exam/i).first()).toBeVisible();
    await expect(page.getByText(/Question 1 of 170/i)).toBeVisible();
    await expect(page.locator("#exam-timer")).toBeVisible();

    // Verify palette displays items
    await page.getByRole("button", { name: /palette/i }).click();
    await expect(page.getByText(/Question Navigator/i)).toBeVisible();
  });
});
