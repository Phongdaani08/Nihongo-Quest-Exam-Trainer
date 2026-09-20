# Data Sources Page PRD

## Problem Statement

Administrators need one focused place to view and manage connections to supported data providers. The existing page presents provider cards and unrelated CSV import behavior, so it does not support connection-level search, creation, editing, testing, status feedback, or role-based access configuration.

## Solution

Provide an admin-only Data Sources page at `/admin/data-sources` with a searchable connection table and modal workflows for adding, editing, and testing PostgreSQL, BigQuery, and Snowflake connections. The first implementation uses an in-memory repository behind a stable frontend interface so the UI can later connect to a backend adapter without being rewritten.

## User Stories

1. As an Admin, I want to view all Data Source Connections, so that I understand which data platforms are configured.
2. As an Admin, I want connections sorted by name, so that the list is predictable.
3. As an Admin, I want to search across connection metadata, so that I can quickly find a connection.
4. As an Admin, I want clearing search to restore all connections, so that filtering is reversible.
5. As an Admin, I want loading, empty, and error states, so that system state is clear.
6. As an Admin, I want to retry a failed list request, so that transient failures are recoverable.
7. As an Admin, I want to add a PostgreSQL connection, so that GenBI can use a PostgreSQL data source.
8. As an Admin, I want PostgreSQL defaults for port and schema, so that common configuration is faster.
9. As an Admin, I want to add a BigQuery connection, so that GenBI can use a BigQuery dataset.
10. As an Admin, I want to add a Snowflake connection, so that GenBI can use a Snowflake database and schema.
11. As an Admin, I want provider-specific fields, so that only relevant information is requested.
12. As an Admin, I want required-field validation, so that incomplete connections cannot be submitted.
13. As an Admin, I want to assign one or more Allowed Roles, so that access can be scoped.
14. As an Admin, I want new connections enabled by default, so that a valid connection is immediately usable.
15. As an Admin, I want to test draft values without saving, so that I can validate configuration safely.
16. As an Admin, I want test feedback inside the modal, so that the result stays in context.
17. As an Admin, I want successful creation to add a row and close the modal, so that completion is obvious.
18. As an Admin, I want failed creation to preserve non-secret input, so that I can correct it efficiently.
19. As an Admin, I want to edit an existing connection, so that configuration can be maintained.
20. As an Admin, I want provider type to remain read-only during editing, so that connection identity is stable.
21. As an Admin, I want existing credentials hidden, so that secrets are not exposed.
22. As an Admin, I want an optional Replacement Credential, so that credentials can be rotated safely.
23. As an Admin, I want an empty Replacement Credential to keep the existing secret, so that unrelated edits do not erase credentials.
24. As an Admin, I want to test an existing connection from its row, so that availability can be checked quickly.
25. As an Admin, I want only the active Test button disabled, so that duplicate tests are prevented without blocking unrelated rows.
26. As an Admin, I want successful tests to set status Online, so that the table reflects the result.
27. As an Admin, I want failed tests to set status Failed, so that problems are visible.
28. As an Admin, I want disabled connections labelled Disabled, so that availability is not misleading.
29. As an Admin, I want user-facing errors sanitized, so that infrastructure details and secrets remain private.
30. As a non-Admin, I want access denied, so that connection management remains restricted.
31. As an Admin, I want the Data Sources header to match other admin pages, so that navigation feels visually consistent.
32. As an Admin, I want each provider type shown with a recognizable logo, so that I can scan the table faster.
33. As an Admin, I want Access to show at most one role name and a remaining count, so that rows stay compact even when many roles are allowed.
34. As an Admin, I want the primary page surfaces to use restrained corner radii, so that the interface feels precise rather than overly rounded.
35. As an Admin, I want Add Connection aligned and sized like Add New User, so that primary admin actions remain consistent across management pages.
36. As an Admin, I want to filter Data Source Connections by Connection Status, Provider, and Allowed Role, so that I can narrow the table without losing my search context.
37. As an Admin, I want to select an explicit Authentication Method, so that the credential requested matches the provider configuration.
38. As an Admin, I want incompatible secrets cleared when I change Provider or Authentication Method, so that one provider's credential cannot leak into another request.
39. As an Admin, I want Snowflake Password authentication enabled, so that I can configure the currently supported Snowflake flow.
40. As an Admin, I want unsupported Snowflake Key Pair and OAuth methods marked Coming soon, so that the UI does not imply a working backend flow.
41. As an Admin, I want to upload a BigQuery Service Account JSON Credential, so that JSON credentials are not entered through a password field.
42. As an Admin, I want the JSON credential validated before testing or saving, so that malformed or unrelated files are rejected locally.
43. As an Admin, I want Workload Identity marked Coming soon, so that the UI remains honest about backend capability.
44. As an Admin, I want to search and select multiple Allowed Roles in one control, so that role assignment scales beyond a checkbox list.
45. As an Admin, I want Edit to show only that a credential is configured, so that stored secrets are never prefilled.
46. As an Admin, I want to explicitly choose Replace credential before entering a new secret, so that unrelated edits preserve the existing credential.
47. As an Admin, I want a detailed Connection Test Result, so that I can distinguish authentication and provider-access checks.
48. As an Admin, I want test timing and timestamp details, so that I can understand when and how quickly the connection was checked.
49. As an Admin, I want all Data Sources labels, feedback, and validation messages localized, so that the page follows the selected application language.

## Implementation Decisions

- Keep route components thin and place feature behavior in a dedicated Data Sources module.
- Define a repository interface for listing, creating, updating, and testing connections.
- Provide an in-memory repository for this frontend-only phase and isolate future HTTP mapping in a separate adapter.
- Use a discriminated provider detail model so provider-specific data is explicit and provider type remains immutable.
- Never include credentials in connection entities returned by a repository.
- Represent credential presence as a boolean and accept secrets only in create, replacement, or test inputs.
- Separate search, validation, form mapping, table rendering, modal rendering, and orchestration concerns.
- Keep only Test and Edit as row actions.
- Reuse the compact 46-pixel admin-page header contract.
- Pair provider labels with compact provider-specific visual marks in the Type column.
- Summarize Allowed Roles as the first name followed by `+N` when additional roles exist.
- Place Add Connection in the content title row and match the Add New User control height, padding, typography, icon size, and top-right alignment.
- Use medium corner radii for page-level surfaces and the modal while preserving control-specific radii for inputs, badges, and status indicators.
- Combine search, Connection Status, Provider, and Allowed Role filters with AND semantics; each structured filter provides an All option that removes only its own constraint.
- Derive current Allowed Role filter options from loaded Data Source Connections during the in-memory phase; a future backend adapter should source them from authoritative role data.
- Preserve the legacy route as a redirect to the canonical admin route.
- Use one provider-aware modal for both Add and Edit and keep its state transitions in a dedicated form-orchestration hook.
- Model Authentication Method explicitly and clear incompatible secret values whenever Provider or Authentication Method changes.
- Enable only authentication methods represented by the current repository contract; show unsupported methods as disabled Coming soon options instead of simulating backend flows.
- Accept BigQuery Service Account JSON through a file upload, validate its minimum service-account shape, and retain its raw contents only in transient form state.
- Replace Allowed Role checkboxes with a searchable multi-select while preserving the required-at-least-one-role rule.
- Return sanitized detailed Connection Test Results through the repository interface, including authentication/provider-access checks, latency, and test time.
- Resolve user-facing copy through next-intl in English and Thai; domain services return translation keys rather than display sentences for validation.
- Do not create an ADR because the repository adapter is reversible and conventional rather than a hard-to-reverse architectural decision.

## Testing Decisions

- Test observable repository and domain-service behavior through public interfaces rather than component internals.
- Verify sorted listing and secret exclusion, multi-field search, provider-specific validation, credential replacement semantics, creation, updating, and status transitions.
- Verify Provider and Authentication Method transitions clear incompatible fields, BigQuery rejects malformed JSON credentials, Edit never renders a stored secret, and detailed test results remain sanitized.
- Use deterministic in-memory behavior so tests remain fast and isolated.
- Run the existing frontend test suite, lint, and production build after feature tests pass.

## Out of Scope

- Backend API implementation and persistence.
- Delete, reindex, knowledge ingestion, semantic-layer management, glossary management, metric definitions, CSV import, monitoring, audit logs, query history, detail navigation, and provider marketplace behavior.
- Production credential storage or encryption.
- Snowflake Key Pair and OAuth flows, BigQuery Workload Identity, and any new backend request or response contract.

## Further Notes

The in-memory repository resets when the frontend process or page-owned repository is recreated. A future HTTP repository should map backend payloads into the frontend domain model and retain the rule that stored credentials are never returned.

The current backend has no Snowflake, BigQuery, Key Pair, OAuth, or Workload Identity contract. These UI capabilities remain isolated behind the repository boundary; unsupported methods are deliberately non-interactive until a concrete backend contract exists.
