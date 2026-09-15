# Installation Guide

## Prerequisites

- Node.js 20 or later
- npm
- Git
- VS Code or another JavaScript IDE

Check versions:

```bash
node --version
npm --version
git --version
```

## Install Dependencies

```bash
npm install
```

## Install Browsers

```bash
npx playwright install
```

On Linux or CI:

```bash
npx playwright install --with-deps
```

## Run the Default Demo Suite

```bash
npm test
```

## Browser-Specific Execution

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

## Headed, Debug, and UI Modes

```bash
npm run test:headed
npm run test:debug
npm run test:ui
```

## Run a Specific File

```bash
npx playwright test tests/login.spec.js --project=chromium
```

## Run by Test Name

```bash
npx playwright test -g "valid login"
```

## Run API Tests

```bash
npm run test:api
```

## Environment Selection

```bash
npm run test:demo
npm run test:qa
npm run test:staging
```

If `QA_BASE_URL` or `STAGING_BASE_URL` is not set, the framework uses the demo URL, keeping this portfolio runnable without source edits.

## Override Credentials

```bash
npx cross-env UI_USERNAME=myuser UI_PASSWORD=mypassword playwright test
```

Do not commit private credentials.

## Reports

```bash
npm run report
```

## Trace Viewer

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Troubleshooting

If browser executables are missing, run `npx playwright install`. On Linux, use `npx playwright install --with-deps`. The OrangeHRM demo is shared and may reset data; if its UI changes, update the Page Object locator rather than duplicating selector fixes in test files.
