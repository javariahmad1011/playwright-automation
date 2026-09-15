# Framework Architecture

## Objective

The framework separates test intent, page interaction, test data, configuration, and reporting so each concern can change independently.

## Layers

### Test Layer

Location: `tests/` and `api/`

Responsibilities:

- Define business scenarios
- Orchestrate page objects or API calls
- Perform assertions
- Control setup and cleanup at test level
- Keep implementation details out of scenario descriptions

### Page Object Layer

Location: `pages/`

Responsibilities:

- Own selectors
- Expose reusable page actions
- Synchronize on expected UI states
- Provide page-specific validation helpers
- Prevent selector duplication across test files

Page Objects:

- `LoginPage`
- `DashboardPage`
- `EmployeePage`
- `UserManagementPage`

### Fixture Layer

Location: `fixtures/`

Responsibilities:

- Supply credentials
- Provide authenticated browser pages
- Centralize reusable setup
- Keep test files focused on scenario behavior

### Test Data Layer

Location: `tests-data/` and `fixtures/users.json`

Responsibilities:

- Store repeatable input data
- Separate data from automation logic
- Support data-driven test expansion
- Provide public demo credentials without requiring private secrets

Dynamic values are generated at runtime by `utils/helpers.js`.

### Utility Layer

Location: `utils/`

Responsibilities:

- Environment resolution
- Route constants
- API endpoint constants
- Unique data generation
- Response timing
- Shared formatting helpers

### Configuration Layer

Location: `playwright.config.js`

Controls browsers, retries, parallel execution, timeouts, screenshots, videos, traces, HTML reporting, base URLs, and CI behavior.

### CI Layer

Locations:

- `.github/workflows/playwright.yml`
- `CI-CD/github-actions.yml`

The workflow installs dependencies and browser requirements, runs the Chromium suite, and preserves diagnostic artifacts.

## Execution Flow

```text
Test Scenario
    |
    v
Fixture / Test Data
    |
    v
Page Object or APIRequestContext
    |
    v
Application / API
    |
    v
Assertions
    |
    v
HTML Report + Failure Evidence
```

## Key Design Decisions

Page Object Model centralizes selectors and common page behavior. Dynamic data reduces collisions in shared demo environments. Destructive tests clean up records they create. API tests remain separate from UI workflows so they can run as a faster validation layer. Chromium is used in CI for speed while local execution supports Chromium, Firefox, and WebKit.
