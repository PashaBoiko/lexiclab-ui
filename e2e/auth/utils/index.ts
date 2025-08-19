import { Page, expect } from "@playwright/test";

export function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function loginUser(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/");
  
  // Wait for the page to load 
  await page.waitForLoadState('networkidle');
  
  // Check if we're already logged in by looking for the Avatar button
  const avatarButton = page.getByRole('button', { name: 'Avatar' });
  const isAlreadyLoggedIn = await avatarButton.isVisible();
  
  if (isAlreadyLoggedIn) {
    // Already logged in, skip login process
    return;
  }
  
  // We need to login - expect to be on the login page
  await expect(page).toHaveURL(/#\/login/);
  
  // Wait for form elements to be visible
  await page.waitForSelector('input[type="email"]', { state: 'visible' });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  // Click submit and wait for navigation
  await page.locator('button[type="submit"]').click();

  // Wait for successful login (should redirect away from login page)
  await expect(page).not.toHaveURL(new RegExp("#/login"));
}
