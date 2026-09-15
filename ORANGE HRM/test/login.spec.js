const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const loginData = require('../tests-data/loginData.json');

test.describe('Authentication', () => {
  test('@smoke valid login redirects an authorized user to the dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const username = process.env.UI_USERNAME || loginData.validUser.username;
    const password = process.env.UI_PASSWORD || loginData.validUser.password;

    await loginPage.goto();
    await loginPage.login(username, password);
    await dashboardPage.expectLoaded();
    await dashboardPage.expectUserProfileVisible();
  });

  test('invalid login displays a controlled authentication error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.invalidUser.username, loginData.invalidUser.password);
    await loginPage.expectInvalidCredentials();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('empty credentials trigger required-field validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    await loginPage.expectRequiredFieldErrors(2);
  });

  test('password input is masked in the browser', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectPasswordMasked();
  });

  test('authenticated user can logout and return to the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const username = process.env.UI_USERNAME || loginData.validUser.username;
    const password = process.env.UI_PASSWORD || loginData.validUser.password;

    await loginPage.goto();
    await loginPage.login(username, password);
    await dashboardPage.expectLoaded();
    await dashboardPage.logout();
    await loginPage.expectLoginPage();
  });

  test('authenticated session remains valid after page reload', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const username = process.env.UI_USERNAME || loginData.validUser.username;
    const password = process.env.UI_PASSWORD || loginData.validUser.password;

    await loginPage.goto();
    await loginPage.login(username, password);
    await dashboardPage.expectLoaded();
    await page.reload();
    await dashboardPage.expectLoaded();
  });
});
