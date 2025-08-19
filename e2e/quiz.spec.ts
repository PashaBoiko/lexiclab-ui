import { test, expect } from "@playwright/test";
import { loginUser } from "./auth/utils";

const USER_EMAIL = "pashaboiko96@gmail.com";
const USER_PASSWORD = "Testing123*";

test.describe("Quiz flow", () => {
  test("Should login, start a quiz, answer a question, and see next question", async ({
    page,
  }) => {
    // Login
    await loginUser(page, USER_EMAIL, USER_PASSWORD);

    // Go to Quiz (via main content link)
    await page.getByRole("link", { name: "Go to Quiz" }).click();
    await expect(page).toHaveURL(/#\/quiz/);
    await expect(
      page.getByRole("heading", { name: "Quiz", level: 3 }),
    ).toBeVisible();

    // Start Quiz
    await page.getByRole("button", { name: "Start Quiz" }).click();
    // Wait for first question
    const questionHeading = page.getByRole("heading", { level: 5 });
    await expect(questionHeading).toBeVisible();
    const questionText = await questionHeading.textContent();
    expect(questionText).toContain("What translation is for word");

    // Select the correct answer (for demo, pick the second option)
    const options = page.locator("main li button");
    await expect(options).toHaveCount(3);
    await options.nth(1).click();
    // Click Answer
    const answerBtn = page.getByRole("button", { name: "Answer" });
    await expect(answerBtn).toBeEnabled();
    await answerBtn.click();

    // Assert that a new question appears (heading text changes)
    const newQuestionText = await questionHeading.textContent();
    expect(newQuestionText).not.toBe(questionText);
  });
});
