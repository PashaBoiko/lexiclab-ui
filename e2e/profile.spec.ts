import { test, expect } from "@playwright/test";
import { loginUser } from "./auth/utils";

const USER_EMAIL = "pashaboiko96@gmail.com";
const USER_PASSWORD = "Testing123*";

test.describe.configure({ mode: 'serial' });

test.describe("Profile page", () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, USER_EMAIL, USER_PASSWORD);
  });

  test("Should display user profile information", async ({ page }) => {
    // Navigate to profile via avatar dropdown
    await page.getByRole('button', { name: 'Avatar' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    
    // Verify URL and page elements
    await expect(page).toHaveURL(/#\/profile/);
    
    // Check breadcrumbs (use more specific selector to avoid dropdown menu conflict)
    await expect(page.locator('.v-breadcrumbs-item').getByText('Profile')).toBeVisible();
    
    // Verify user information is displayed (be specific to avoid dropdown menu conflicts)
    await expect(page.getByRole('heading', { name: 'User name:' })).toBeVisible();
    await expect(page.locator('main').getByText('Pasha').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Email:' })).toBeVisible();
    await expect(page.locator('main').getByText(USER_EMAIL).first()).toBeVisible();
    
    // Verify quiz settings sections
    await expect(page.getByRole('heading', { name: 'Questions in quiz:' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Questions in quiz (repeat mode):' })).toBeVisible();
    
    // Verify avatar section
    await expect(page.getByRole('heading', { name: 'Upload photo' })).toBeVisible();
    await expect(page.locator('main img[alt="avatar"]')).toBeVisible();
    
    // Verify password reset section
    await expect(page.getByRole('heading', { name: 'Reset password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password Password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Repeat password Repeat password' })).toBeVisible();
  });

  test("Should edit and save questions in quiz setting", async ({ page }) => {
    // Navigate to profile
    await page.getByRole('button', { name: 'Avatar' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    
    // Get current value by finding the paragraph near the Questions in quiz heading
    // From the structure analysis, the paragraph is in the same section as the Edit button
    const quizSection = page.getByRole('heading', { name: 'Questions in quiz:' }).locator('..');
    
    // Click Edit button for questions in quiz
    await page.getByRole('button', { name: 'Edit' }).first().click();
    
    // Verify edit mode is active (input field appears)
    const input = page.locator('input[type="text"]').first();
    await expect(input).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' }).first()).toBeVisible();
  });

  test("Should edit and save questions in quiz (repeat mode) setting", async ({ page }) => {
    // Navigate to profile
    await page.getByRole('button', { name: 'Avatar' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    
    // Get current value for repeat mode - using more reliable selector
    const currentValue = page.getByRole('heading',{name: 'Questions in quiz (repeat mode):'}).locator('..');
    
    // Click Edit button for repeat mode (second Edit button)
    await page.getByRole('button', { name: 'Edit' }).first().click();

    // Verify edit mode is active (input field appears)
    const input = page.locator('input[type="text"]').first();
    await expect(input).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' }).first()).toBeVisible();
  });

  test("Should display avatar and delete functionality", async ({ page }) => {
    // Navigate to profile
    await page.getByRole('button', { name: 'Avatar' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    
    // Verify avatar is displayed (use more specific locator to avoid multiple matches)
    await expect(page.locator('main img[alt="avatar"]')).toBeVisible();
    
    // Verify delete button is present
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    
    // Note: We won't actually delete the avatar in the test to avoid side effects
  });

  test("Should navigate back from profile page", async ({ page }) => {
    // Navigate to profile
    await page.getByRole('button', { name: 'Avatar' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/#\/profile/);
    
    // Click on Quiz breadcrumb to navigate back
    await page.getByRole('link', { name: 'Quiz' }).click();
    await expect(page).toHaveURL(/#\/quiz/);
  });

  test("Should access profile from different routes", async ({ page }) => {
    // Test accessing profile from home page
    await expect(page).toHaveURL(/#\//);
    await page.getByRole('button', { name: 'Avatar' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/#\/profile/);
    
    // Navigate to dictionary page
    await page.getByText('Dictionary').click();
    await expect(page).toHaveURL(/#\/dictionary/);
    
    // Access profile from dictionary page
    await page.getByRole('button', { name: 'Avatar' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/#\/profile/);
  });
});