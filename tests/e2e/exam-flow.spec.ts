import { test, expect } from "@playwright/test";

test.describe("Civil Service Exam Reviewer E2E Flows", () => {
  test.beforeEach(async ({ context }) => {
    // Seed cookie consent in localStorage so the banner is dismissed during exam interaction
    await context.addInitScript(() => {
      window.localStorage.setItem(
        "csereviewer_cookie_consent",
        JSON.stringify({
          essential: true,
          analytics: false,
          ads: false,
          hasChosen: true,
          updatedAt: Date.now(),
        })
      );
    });
  });

  test("loads landing page with exam preparation options", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Civil Service Exam Reviewer/i);
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
    await expect(page.getByText("Estimated Score", { exact: true })).toBeVisible();
    await expect(page.getByText(/Score Interpretation & Official CSC Rating Notice/i)).toBeVisible();
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

  test("automatically submits exam when timer expires on timeout without clicking submit", async ({ page }) => {
    // Navigate with a 2-second test expiry timer
    await page.goto("/exams/professional/quick?testExpirySeconds=2");

    await expect(page.locator("#exam-timer")).toBeVisible();
    await expect(page.getByText(/Question 1 of 10/i)).toBeVisible();

    // Select an answer
    const firstChoice = page.locator("button:has(span.rounded-lg:text('A'))").first();
    await firstChoice.click();

    // Do NOT click submit; wait for timer to expire (2 seconds) and automatically submit
    await page.waitForURL(/\/results\/.+/, { timeout: 15000 });
    await expect(page.getByText("Estimated Score", { exact: true })).toBeVisible();
    await expect(page.getByText(/Score Interpretation & Official CSC Rating Notice/i)).toBeVisible();
    await expect(page.getByText(/Subtest Performance Breakdown/i)).toBeVisible();
    await expect(page.getByText(/Detailed Answer Review/i)).toBeVisible();
  });

  test("auto-saves in-progress exam, displays resume prompt on reload, and bookmarks question to dashboard", async ({ page }) => {
    await page.goto("/exams/professional/quick");

    // Select choice on Q1
    const firstChoice = page.locator("button:has(span.rounded-lg:text('A'))").first();
    await firstChoice.click();

    // Reload the page
    await page.reload();

    // Verify resume prompt banner
    await expect(page.getByText(/Unfinished Session Found/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Resume Session/i })).toBeVisible();

    // Click Resume
    await page.getByRole("button", { name: /Resume Session/i }).click();
    await expect(page.getByText(/Unfinished Session Found/i)).not.toBeVisible();

    // Submit
    await page.getByRole("button", { name: /submit/i }).first().click();
    await page.locator("#confirm-submit-btn").click();
    await page.waitForURL(/\/results\/.+/);

    // Click bookmark button on Q1
    const bookmarkBtn = page.getByTitle("Bookmark Question").first();
    await bookmarkBtn.click();

    // Navigate to dashboard
    await page.goto("/dashboard");
    await expect(page.getByText("Your Progress is Saved Locally")).toBeVisible();
    await expect(page.getByText("Export Backup (JSON)")).toBeVisible();

    // Check Bookmarks page
    await page.goto("/dashboard/bookmarks");
    await expect(page.getByRole("button", { name: /Practice Bookmarks/i })).toBeVisible();
  });

  test("supports keyboard shortcuts, choice elimination, and virtual scratchpad in exam runner", async ({ page }) => {
    await page.goto("/exams/professional/quick");

    await expect(page.locator("#exam-timer")).toBeVisible();
    await expect(page.getByText(/Question 1 of 10/i)).toBeVisible();

    // Press 'A' key to select choice A on Q1
    await page.keyboard.press("a");
    const choiceACard = page.locator("button:has(span.rounded-lg:text('A'))").first().locator("..");
    await expect(choiceACard).toHaveClass(/border-brand-600/);

    // Press 'F' key to flag question
    await page.keyboard.press("f");
    await expect(page.locator("#flag-question-button")).toContainText(/Flagged/i);

    // Press 'ArrowRight' to navigate to Question 2
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText(/Question 2 of 10/i)).toBeVisible();

    // Cross-out (eliminate) Option B on Question 2
    const eliminateBtn = page.getByRole("button", { name: /Cross-out Option B/i }).first();
    await eliminateBtn.click();
    await expect(page.getByRole("button", { name: /Restore Option B/i })).toBeVisible();

    // Open Virtual Scratchpad via button
    await page.getByRole("button", { name: /Scratchpad/i }).first().click();
    await expect(page.getByText(/Scratchpad & Arithmetic Canvas/i)).toBeVisible();

    // Switch to Type Notes tab and enter calculation
    await page.getByRole("button", { name: /Type Notes/i }).click();
    const notesInput = page.getByPlaceholder(/Type calculations or thoughts here/i);
    await notesInput.fill("120 * 0.8 = 96");
    await expect(notesInput).toHaveValue("120 * 0.8 = 96");

    // Close scratchpad
    await page.getByRole("button", { name: /Keep Working/i }).click();
    await expect(page.getByText(/Scratchpad & Arithmetic Canvas/i)).not.toBeVisible();
  });
});
