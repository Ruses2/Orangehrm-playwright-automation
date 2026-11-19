import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ADMIN, INVALID_USER, WRONG_PASSWORD } from '../fixtures/testData';

test.describe('OrangeHRM Login', () => {

  // Before every test — just open the login page
  // No need to be logged in yet for login tests
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // Happy Path

  test('admin can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(ADMIN.username, ADMIN.password);

    // After valid login — URL should change to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  // Error Scenarios

  test('shows error for completely wrong username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(INVALID_USER.username, INVALID_USER.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });

  test('shows error when correct username but wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(WRONG_PASSWORD.username, WRONG_PASSWORD.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });

  test('shows error when both fields are left empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Click login without typing anything
    await loginPage.login('', '');

    // OrangeHRM shows "Required" below each empty field
    const requiredErrors = page.locator('.oxd-input-field-error-message');
    await expect(requiredErrors).toHaveCount(2);  // one under username, one under password
  });

  test('shows error when only username is filled', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(ADMIN.username, '');

    const requiredErrors = page.locator('.oxd-input-field-error-message');
    await expect(requiredErrors).toHaveCount(1);  // only password field errors
  });

  // UI Checks

  test('forgot password link is visible on login screen', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const isVisible = await loginPage.isForgotPasswordVisible();
    expect(isVisible).toBe(true);
  });

  // Logout 

  test('user can logout and is returned to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // First login
    await loginPage.login(ADMIN.username, ADMIN.password);
    await page.waitForURL(/dashboard/);

    // Then logout using the dropdown
    await page.locator('.oxd-userdropdown-tab').click();
    await page.locator('a:has-text("Logout")').click();

    // Should land back on login
    await expect(page).toHaveURL(/login/);
  });

});