# Automation Strategy

## Scope

The framework automates high-value regression scenarios across UI and API layers.

### UI Scope

Authentication covers success, invalid credentials, required fields, password masking, logout, and session persistence.

Employee Management covers create, search, update, delete, and data validation.

User Management covers create, search, update, delete, and role/status filtering.

Dashboard coverage validates page availability, widgets, navigation, and profile access.

### API Scope

Users cover GET, POST, PUT, and DELETE. Authentication covers valid login, token extraction, token-authorized access, invalid credentials, and missing-token behavior.

## Risk-Based Priority

Highest priority includes authentication, authorization, core employee CRUD, user administration, and API contract failures. Dashboard and filtering scenarios are medium priority. Purely cosmetic checks are lower priority.

## Isolation Strategy

Each destructive UI test creates unique data where possible. Tests do not depend on data created by earlier tests, which supports parallel execution and retries.

## Locator Strategy

Preferred order:

1. Accessible role and name
2. Stable form attributes
3. Semantic text
4. Stable application classes when no better contract exists

Long CSS chains, arbitrary XPath, and fixed sleeps are avoided.

## Environment Strategy

`ENV` supports `demo`, `qa`, and `staging`. Direct `BASE_URL` and `API_BASE_URL` values can override defaults.

## CI Strategy

A practical enterprise model is:

- Pull request: Chromium smoke plus API
- Nightly: full Chromium regression
- Release: Chromium, Firefox, and WebKit
- Post-release: production-safe smoke suite

The portfolio CI workflow runs Chromium for fast feedback and uploads evidence on failure.

## Exit Criteria

A build is suitable for promotion when critical smoke coverage passes, authentication and API contracts pass, and any failures are triaged as product, environment, test-data, or automation issues.
