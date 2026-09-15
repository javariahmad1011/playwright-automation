const { expect } = require('@playwright/test');
const { routes } = require('../utils/constants');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: /login/i });
    this.invalidCredentialsAlert = page.locator('.oxd-alert-content-text');
    this.requiredMessages = page.locator('.oxd-input-field-error-message');
    this.loginHeading = page.getByRole('heading', { name: /login/i });
  }

  async goto() {
    await this.page.goto(routes.login);
    await expect(this.loginHeading).toBeVisible();
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectInvalidCredentials() {
    await expect(this.invalidCredentialsAlert).toContainText(/invalid credentials/i);
  }

  async expectRequiredFieldErrors(expectedCount = 2) {
    await expect(this.requiredMessages).toHaveCount(expectedCount);
  }

  async expectPasswordMasked() {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  async expectLoginPage() {
    await expect(this.page).toHaveURL(/\/auth\/login/);
    await expect(this.loginHeading).toBeVisible();
  }
}

module.exports = LoginPage;
