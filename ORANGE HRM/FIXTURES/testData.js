const { test: base, expect } = require('@playwright/test');
const users = require('./users.json');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');

const test = base.extend({
  credentials: async ({}, use) => {
    await use({
      username: process.env.UI_USERNAME || users.admin.username,
      password: process.env.UI_PASSWORD || users.admin.password,
    });
  },

  authenticatedPage: async ({ page, credentials }, use) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await dashboardPage.expectLoaded();

    await use(page);
  },
});

module.exports = { test, expect };
