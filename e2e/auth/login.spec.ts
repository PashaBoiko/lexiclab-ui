import { test, expect } from "@playwright/test";

test.describe("Login flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Should display login form", async ({ page }) => {
    await expect(page.locator('[data-testid="login-title"]')).toBeVisible();

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("Should display validation login form", async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    await expect(
      page.locator('[data-testid="login-email"]').locator('[role="alert"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="login-password"]').locator('[role="alert"]'),
    ).toBeVisible();
  });

  test("Should login with valid credentials", async ({ page }) => {
    await expect(page).toHaveURL(new RegExp("#/login"));

    await page.fill('input[type="email"]', "pashatest@gmail.com");
    await page.fill('input[type="password"]', "test1234");

    await page.locator('button[type="submit"]').click();

    await expect(page).not.toHaveURL(new RegExp("#/login"));
  });

  test("Should show error with invalid credentials", async ({ page }) => {
    await page.fill('input[type="email"]', "wrong_email");
    await page.fill('input[type="password"]', "wrong_password");
    await page.click('button[type="submit"]');

    await expect(page.locator(".v-snackbar")).toBeVisible();
    await expect(page).toHaveURL(new RegExp("#/login"));

  });
});
