import { timeout } from "../playwright.config";

export class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators of each element on the login screen
    this.usernameInput  = page.locator('input[name="username"]');
    this.passwordInput  = page.locator('input[name="password"]');
    this.loginButton    = page.locator('button[type="submit"]');
    this.errorMessage   = page.locator('.oxd-alert-content-text');
    this.forgotPassword = page.locator('p:has-text("Forgot your password")');
  }

  // Go to the login page directly
  async goto() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  }

  // Fill in credentials and click login
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Read the error message text that appears on bad login
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  // Check if forgot password link is there
  async isForgotPasswordVisible() {
    await this.forgotPassword.waitFor({ state: 'visible', timeout: 10000 });
    return await this.forgotPassword.isVisible();
  }

  // Clear both fields used in empty field test
  async clearAllFields() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}