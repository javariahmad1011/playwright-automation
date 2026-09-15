# Playwright Automation Best Practices

## Keep Tests Intent-Focused

Tests should describe business behavior instead of repeating raw selector steps. Page objects own page interactions and selectors.

## Use Unique Data

Shared environments create collision risk. Runtime employee names and usernames are generated uniquely.

## Clean Up Created Data

Destructive tests attempt to remove data they create, including cleanup in `finally` blocks when appropriate.

## Avoid Test Dependencies

Each test should prepare the data it requires instead of depending on previous tests.

## Prefer Auto-Waiting

Do not use arbitrary `waitForTimeout` calls. Wait for visible UI state, URL changes, or business confirmation messages.

## Protect Credentials

Production credentials should come from environment variables, GitHub Actions secrets, or a secret manager. Public demo credentials used by this portfolio are not production secrets.

## Use Retries Carefully

Retries help expose intermittent behavior but should never be used to hide unstable automation.

## Validate API Contracts

API tests should validate status, body structure, important values, headers, authentication behavior, negative paths, and response time.

## Capture Diagnostic Evidence

Traces are particularly valuable because they include DOM snapshots, network activity, console output, actions, and timing.

## Treat Flakiness as a Defect

Classify flaky behavior as product instability, environment instability, test-data collision, selector weakness, synchronization issue, or an actual intermittent product defect.
