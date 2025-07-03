import { test, expect } from "@playwright/test";
import { generateRandomString } from "./utils";

test.describe("Register.vue", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator('button[data-testid="appbar-sign-up-button"]').click();
  });

  test("Should display register form", async ({ page }) => {
    await expect(page.locator('[data-testid="sign-up-title"]')).toBeVisible();

    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="nativeLanguage"]')).toBeVisible();
    await expect(
      page.locator('input[name="foreignLanguage"]'),
    ).not.toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("Should create account with valid data", async ({ page }) => {
    const username = generateRandomString(10);

    await page.fill('input[name="name"]', username);
    await page.fill('input[name="email"]', `${username}@gmail.com`);

    /****** Select Native language */
    await page.evaluate(() => {
      const elem = document.querySelector(
        `div[data-testid="sign-up-native-language-select"] .v-field`,
      );
      const event = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      elem.dispatchEvent(event);
    });
    await page
      .locator(".v-overlay__content.v-select__content .v-list-item")
      .first()
      .click();
    /****** END *****/

    /****** Select Foreign Language */
    await page.evaluate(() => {
      const elem = document.querySelector(
        `div[data-testid="sign-up-foreign-language-select"] .v-field`,
      );
      const event = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      elem.dispatchEvent(event);
    });

    await page
      .locator(".v-overlay__content.v-select__content .v-list-item")
      .first()
      .click();
    /****** END *****/

    await page.fill('input[name="password"]', "test1234");
    await page.locator('button[type="submit"]').click();

    await expect(page.locator(".v-snackbar .bg-success")).toBeVisible();
    await expect(page).toHaveURL(new RegExp("#/login"));
  });

  test("Should display validation sign up form", async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    await expect(
      page.locator('[data-testid="sign-up-name"]').locator('[role="alert"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="sign-up-email"]').locator('[role="alert"]'),
    ).toBeVisible();
    await expect(
      page
        .locator('[data-testid="sign-up-native-language-select"]')
        .locator('[role="alert"]'),
    ).toBeVisible();
    await expect(
      page
        .locator('[data-testid="sign-up-password"]')
        .locator('[role="alert"]'),
    ).toBeVisible();
  });
});
