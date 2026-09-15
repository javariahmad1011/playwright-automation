# Playwright Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-JavaScript-2EAD33?logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)
![POM](https://img.shields.io/badge/Design-Page%20Object%20Model-blue)
![API Testing](https://img.shields.io/badge/API-Playwright%20RequestContext-purple)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
![Portfolio](https://img.shields.io/badge/Portfolio-QA%20Automation-informational)

A professional Playwright automation framework built with JavaScript for a QA Automation Engineer portfolio. The project demonstrates maintainable UI automation, Page Object Model design, reusable fixtures, data-driven testing, API validation, failure diagnostics, reporting, multi-browser execution, environment handling, and CI/CD integration.

The default UI target is the public OrangeHRM demo environment and the API examples use DummyJSON. Both are third-party demo systems, so their test data can be reset or changed independently of this repository.

## Project Overview

This framework is designed as a realistic automation project rather than a collection of isolated scripts. Test logic is separated from page interaction logic, test data is externalized, common workflows are reusable, and execution behavior is controlled centrally through `playwright.config.js`.

The automated coverage includes authentication, employee management, user administration, dashboard validation, and REST API testing.

## Features

- Page Object Model with reusable locators and business actions
- Playwright Test Runner with Chromium, Firefox, and WebKit projects
- Data-driven tests using JSON and JavaScript fixtures
- Configurable UI and API base URLs
- Demo, QA, and staging environment support
- Headed, headless, debug, and UI execution modes
- Parallel test execution
- Automatic retry support
- Screenshots on failure
- Video retention on failure
- Playwright trace capture on failure
- HTML and console reporting
- API testing using `APIRequestContext`
- Response status, body, header, and response-time assertions
- GitHub Actions CI pipeline
- Unique test-data generation to reduce collisions on shared environments
- Cleanup logic for data created by destructive tests where practical

## Technology Stack

| Area | Technology |
|---|---|
| Automation | Playwright |
| Language | JavaScript |
| Test Runner | Playwright Test |
| Design Pattern | Page Object Model |
| Runtime | Node.js |
| Package Manager | npm |
| API Testing | Playwright `APIRequestContext` |
| Reporting | Playwright HTML Report |
| CI/CD | GitHub Actions |
| Version Control | Git / GitHub |
| IDE | VS Code |

## Framework Architecture

```text
playwright-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── api/
│   ├── authAPI.spec.js
│   └── userAPI.spec.js
├── CI-CD/
│   └── github-actions.yml
├── Documentation/
│   ├── Automation_Strategy.md
│   ├── Best_Practices.md
│   ├── Framework_Architecture.md
│   └── Installation_Guide.md
├── fixtures/
│   ├── testData.js
│   └── users.json
├── pages/
│   ├── DashboardPage.js
│   ├── EmployeePage.js
│   ├── LoginPage.js
│   └── UserManagementPage.js
├── reports/
│   └── .gitkeep
├── screenshots/
│   └── .gitkeep
├── tests/
│   ├── api-testing.spec.js
│   ├── dashboard.spec.js
│   ├── employee.spec.js
│   ├── login.spec.js
│   └── user-management.spec.js
├── tests-data/
│   ├── employeeData.json
│   └── loginData.json
├── utils/
│   ├── constants.js
│   └── helpers.js
├── videos/
│   └── .gitkeep
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.js
└── README.md
```

The active GitHub Actions workflow is stored in `.github/workflows/playwright.yml`. A readable copy is also kept under `CI-CD/github-actions.yml` to make the CI implementation easy to review during interviews.

## Environment Model

The framework works immediately against the demo environment:

```bash
npm test
```

Environment selection is controlled with `ENV`.

```bash
npm run test:demo
npm run test:qa
npm run test:staging
```

`qa` and `staging` can use organization-specific endpoints by setting `QA_BASE_URL` and `STAGING_BASE_URL`. If they are not supplied, the framework safely falls back to the demo URL so the repository remains runnable without editing source files.

Runtime values can also be overridden directly:

```bash
BASE_URL=https://example.test API_BASE_URL=https://dummyjson.com npm test
```

## Installation

Prerequisites:

- Node.js 20 or later
- npm
- Git

Install project dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

For Linux/CI environments:

```bash
npx playwright install --with-deps
```

## Running Tests

Run the complete suite headlessly:

```bash
npm test
```

Run only Chromium:

```bash
npm run test:chromium
```

Run Firefox:

```bash
npm run test:firefox
```

Run WebKit:

```bash
npm run test:webkit
```

Run tests in headed mode:

```bash
npm run test:headed
```

Run Playwright UI mode:

```bash
npm run test:ui
```

Run in debug mode:

```bash
npm run test:debug
```

Run API tests only:

```bash
npm run test:api
```

Run smoke coverage:

```bash
npm run test:smoke
```

Run authentication tests:

```bash
npm run test:auth
```

Run employee tests:

```bash
npm run test:employee
```

Run user-management tests:

```bash
npm run test:users
```

## Test Coverage

### Authentication

- Valid login
- Invalid login
- Empty credentials
- Password masking
- Logout
- Session persistence after page reload

### Employee Management

- Add employee
- Edit employee
- Delete employee
- Search employee
- Validate employee details

### User Management

- Create system user
- Update user status
- Delete user
- Search user
- Filter users by role and status

### Dashboard

- Dashboard page validation
- Widget validation
- Sidebar navigation validation
- User profile validation

### API Testing

- GET request validation
- POST request validation
- PUT request validation
- DELETE request validation
- Authentication token extraction
- Authenticated endpoint validation
- Negative authentication validation
- Response headers
- Response payload contract
- Response time

## Test Data Strategy

Static data is stored in `tests-data/` and `fixtures/`. Runtime entities use timestamp-based values so repeated runs are less likely to collide on a shared test environment.

For real company projects, credentials should be supplied through CI secrets or environment variables rather than committed into source control. The credentials included here are only public demo credentials for the default demo target.

## Reporting

The framework produces a Playwright HTML report under:

```text
reports/html/
```

Open the latest report with:

```bash
npm run report
```

The configuration also writes run-time artifacts to `test-results/`.

## Screenshots, Videos, and Traces

Failure evidence is configured centrally:

- Screenshot: captured on failure
- Video: retained on failure
- Trace: retained on failure

Open a trace with:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

The `screenshots/`, `videos/`, and `reports/` directories are retained in Git with `.gitkeep` files. Playwright's raw execution artifacts remain under `test-results/` and are ignored by Git.

## CI/CD

GitHub Actions performs the following steps:

1. Checks out the repository
2. Sets up Node.js
3. Installs dependencies
4. Installs Chromium with Playwright system dependencies
5. Runs the Chromium automation suite
6. Uploads the HTML report
7. Uploads failure artifacts for troubleshooting

The executable workflow is:

```text
.github/workflows/playwright.yml
```

## Debugging Failures

Use Playwright debug mode:

```bash
npm run test:debug
```

Run a single test file:

```bash
npx playwright test tests/login.spec.js --project=chromium
```

Run a single test by title:

```bash
npx playwright test -g "valid login"
```

Inspect the trace from a failed run:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Quality Principles Used

- Tests express business intent instead of raw selector steps
- Page Objects own locators and page-specific actions
- Test data is externalized from test logic
- Repeated workflows are implemented once
- Assertions verify user-visible outcomes and API contracts
- Destructive tests create unique data and perform cleanup
- Hard waits are avoided; Playwright auto-waiting and explicit state assertions are preferred
- Secrets are not required for the default portfolio execution
- CI runs a focused browser project while local execution supports all browsers

## Future Improvements

- Add visual regression baselines for stable application areas
- Add accessibility scans with `@axe-core/playwright`
- Add authentication state reuse for larger regression suites
- Publish HTML reports to GitHub Pages
- Add test sharding across CI workers
- Add Docker execution
- Add contract/schema validation for additional APIs
- Integrate test-management result publishing

## Documentation

Detailed implementation notes are available under `Documentation/`:

- `Framework_Architecture.md`
- `Installation_Guide.md`
- `Automation_Strategy.md`
- `Best_Practices.md`

## Author

**QA Automation Engineer Portfolio**

Focus areas: Playwright, JavaScript, Page Object Model, UI automation, API automation, CI/CD, debugging, and maintainable test-framework design.
