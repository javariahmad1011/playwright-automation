const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

const { getEnvironmentConfig } = require('./utils/constants');

const environment = getEnvironmentConfig(process.env.ENV || 'demo');

module.exports = defineConfig({
  testDir: '.',
  testMatch: [
    'tests/**/*.spec.js',
    'api/**/*.spec.js',
  ],
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'reports/html',
      open: 'never',
    }],
  ],
  use: {
    baseURL: process.env.BASE_URL || environment.uiBaseUrl,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    headless: process.env.HEADED !== 'true',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO || 0),
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
