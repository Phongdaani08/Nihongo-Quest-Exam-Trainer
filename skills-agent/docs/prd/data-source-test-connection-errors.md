# Data Source Test Connection Errors PRD

## Problem Statement

When an administrator tests a Data Source Connection and the provider rejects or cannot complete the connection, AI GenBI currently shows only a generic failure. The backend failure reaches the frontend adapter, but the Connection Test Result drops the diagnostic details before the modal renders them. Administrators therefore cannot distinguish an unreachable host from rejected credentials or another provider failure.

## Solution

Return a sanitized, source-derived Connection Test Result for failed draft and saved-connection tests. The result must state the failure reason, a stable diagnostic code, and a suggested action while excluding credentials, connection strings, session material, and unsafe raw provider output. The existing result panel will render these details in the modal without changing the connection workflow.

## User Stories

1. As an administrator, I want a failed connection test to explain why it failed, so that I know what to correct.
2. As an administrator, I want an unreachable provider to be identified as a connectivity failure, so that I can verify the host, port, network, or provider availability.
3. As an administrator, I want rejected credentials to be identified as an authentication failure, so that I can verify the configured identity and secret.
4. As an administrator, I want a stable failure code, so that support and logs can refer to the same failure category.
5. As an administrator, I want a suggested action with each failure, so that I can recover without interpreting driver terminology.
6. As an administrator, I want the failure details displayed inside the connection modal, so that the feedback remains next to the configuration being tested.
7. As a security owner, I want credentials and connection strings removed from displayed diagnostics, so that a failed test cannot disclose a secret.
8. As a security owner, I want unknown provider output converted to a safe fallback, so that unclassified driver errors are not exposed verbatim.
9. As a developer, I want connection-error classification isolated behind one interface, so that provider-specific mappings can expand without changing the modal.
10. As a tester, I want deterministic coverage for connectivity, authentication, unknown failures, and secret redaction, so that diagnostics remain useful and safe after refactoring.

## Implementation Decisions

- Preserve Connection Test Result as the frontend domain contract.
- Add a focused error-classification module that accepts an unknown backend failure and returns a sanitized reason, stable code, and suggested action.
- Classify common connectivity and authentication failures from the backend-provided failure message.
- Treat unclassified failures as a safe generic provider error rather than displaying raw driver output.
- Populate the existing failure details on both draft and saved-connection tests.
- Continue to keep credentials transient and never add them to returned Data Source Connections.
- Reuse the existing result panel; do not introduce another modal or notification surface.
- Do not create an ADR because the classifier and repository mapping are conventional and reversible.

## Testing Decisions

- Test observable classification behavior through the classifier's public interface.
- Verify that a connection-refused failure produces a connectivity reason, code, and action.
- Verify that an authentication-rejected failure produces an authentication reason, code, and action.
- Verify that credentials, encoded credentials, and connection URLs are absent from all returned diagnostics.
- Verify that an unknown raw backend error becomes a safe fallback.
- Verify that a failed Connection Test Result renders its reason, code, and suggested action in the existing panel.
- Run the focused Data Sources tests, the complete frontend test suite, lint, and a production build.

## Out of Scope

- Resync timeout and status handling.
- Background health checks and Data Sources list loading behavior.
- Adding or completing provider executors.
- Changing credential persistence or encryption.
- Changing the backend error-response schema.
- Localizing provider-specific diagnostic sentences in this iteration.

## Further Notes

The diagnostic is source-derived but intentionally not a raw provider error. This follows the domain definition of a Connection Test Result as a sanitized outcome that never contains a secret or unsafe provider output.
