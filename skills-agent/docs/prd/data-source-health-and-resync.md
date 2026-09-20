# Data Source Health and Resync PRD

## Problem Statement

When one saved Data Source Connection becomes unavailable, the Data Sources page can remain loading because listing connections performs live schema discovery before responding. The unavailable connection can continue to appear Ready, while Resync can wait for several minutes, discover the schema twice, and exit without recording a Failed Connection Status on every failure path.

## Solution

Make connection listing independent from provider availability by returning persisted health and cached schema metadata. Bound connection, schema discovery, and Resync operations with server-side timeouts. Persist the latest sanitized Connection Status, run bounded health checks in the background, reuse a single discovered schema during Resync, and refresh the failed status in the frontend when Resync fails.

## User Stories

1. As an administrator, I want the Data Sources page to load even when one provider is unavailable, so that one failure does not block management of every connection.
2. As an administrator, I want a saved connection's latest known availability displayed independently from its onboarding readiness, so that Ready is not mistaken for Online.
3. As an administrator, I want an unavailable provider to become Failed after a bounded health check, so that stale Online status does not persist indefinitely.
4. As an administrator, I want a recovered provider to return to Online automatically, so that I do not need to recreate its connection.
5. As an administrator, I want Resync to stop after a configured deadline, so that the interface never spins indefinitely.
6. As an administrator, I want failed and timed-out Resync attempts to persist a Failed status, so that refreshing the page preserves the outcome.
7. As an administrator, I want Resync to discover schema once, so that the provider is not queried twice for the same operation.
8. As a Knowledge Base user, I want cached schema and RAG content retained while a provider is offline, so that temporary outages do not erase knowledge assets.
9. As an operator, I want health checks to have bounded concurrency, so that monitoring does not overload providers or the AI GenBI backend.
10. As an operator, I want timeout and health intervals configurable through environment variables, so that production deployments can tune them without rebuilding.
11. As a security owner, I want persisted health errors sanitized, so that credentials and raw connection strings are never stored as display diagnostics.
12. As a developer, I want the existing database summary fields preserved, so that Data Sources and Knowledge Base consumers remain backward compatible.

## Implementation Decisions

- Keep Connection Readiness and Connection Status as separate concepts.
- Persist the latest Connection Status, last health-check timestamp, sanitized health error code and message, and consecutive failure count.
- Preserve the existing database-summary response fields and derive table counts from cached schema metadata.
- Listing Data Source Connections performs no provider network I/O.
- Apply server-side timeouts at connection, schema-discovery, and total Resync boundaries; the BFF timeout remains a slightly larger safety boundary.
- Reuse the schema discovered at the start of Resync for diffing, cache refresh, profiling, and indexing.
- Retain schema cache and RAG content when a provider becomes unavailable.
- Run health checks in the background with bounded concurrency and a configurable failure threshold.
- Attempt to restore an executor for saved connections that were unavailable during startup.
- Keep Resync synchronous in this change to preserve the API contract and minimize impact; durable asynchronous jobs remain a future scalability option.
- Do not create an ADR because the state separation is already implied by the domain glossary and the synchronous compatibility choice is reversible.

## Testing Decisions

- Test timeout behavior through a public timeout boundary with deterministic paused/sleeping futures.
- Test successful operations remain unaffected by the timeout wrapper.
- Test cached schema metadata produces the existing table-count contract without provider I/O.
- Test health-state transitions and sanitized failure persistence against PostgreSQL where integration infrastructure permits.
- Re-run backend unit and integration tests, frontend tests and lint, production builds, and Docker Compose E2E checks.

## Out of Scope

- A durable Resync job queue and progress events.
- Completing providers whose executors are currently stubs.
- Removing cached schema or RAG content when a provider is offline.
- Changing the existing permissions and tenant access model.
- Changing the public database-summary field names.

## Further Notes

Connection Status is eventually consistent for passive outages. Explicit Test Connection and Resync failures update it immediately; background checks update it according to the configured interval and failure threshold.
