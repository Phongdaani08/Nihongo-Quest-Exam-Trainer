## Problem Statement

AI GenBI users do not have a dedicated place to find product documentation, report problems, contact support, or copy safe diagnostic information. The existing Support item in navigation does not lead to a page.

## Solution

Provide a localized, responsive Support page available to every authenticated account type. The page presents documentation discovery, a validated Support Issue Report form, configuration-backed contact information, and a safe system-information summary. Until Rust API contracts exist, asynchronous behavior is isolated behind a typed local service that can be replaced without changing UI components.

## User Stories

1. As an AI GenBI user, I want to open Support from the application navigation, so that I can get help without leaving the product shell.
2. As an AI GenBI user, I want to search available documentation, so that I can resolve common questions independently.
3. As an AI GenBI user, I want to browse documented categories, so that I can narrow the subject of my search.
4. As an AI GenBI user, I want clear empty, loading, and failure feedback during documentation search, so that I understand the state of the content source.
5. As an AI GenBI user, I want to classify and describe a problem, so that a future support integration receives useful information.
6. As an AI GenBI user, I want required-field validation beside the relevant controls, so that I can correct a report before submission.
7. As an AI GenBI user, I want my report draft preserved after a failed submission, so that I do not need to re-enter it.
8. As an AI GenBI user, I want duplicate submissions prevented, so that one action does not create multiple reports.
9. As an AI GenBI user, I want accessible success and error feedback, so that I know whether submission completed.
10. As an AI GenBI user, I want support contact details to come from product configuration, so that the page does not present stale organization-specific information.
11. As an AI GenBI user, I want to see safe system information, so that I can provide context when asking for help.
12. As an AI GenBI user, I want to copy system information in one action, so that I can paste it into a support conversation.
13. As a security-conscious user, I want diagnostics to exclude credentials and session data, so that requesting help does not disclose secrets.
14. As a mobile or keyboard user, I want the page to remain usable and navigable, so that support is available regardless of device or input method.
15. As a Thai or English user, I want all interface text localized, so that I can understand the support workflow.

## Implementation Decisions

- Support is a standalone authenticated page inside the existing application shell and is available to every account type.
- Documentation, contact details, issue submission, and system information share one typed service boundary.
- The initial documentation source contains categories but no invented article content.
- Contact values come from public runtime configuration and have an explicit unconfigured state.
- Support Issue Reports use a local preview implementation until a backend contract exists; the interface makes that limitation visible.
- Diagnostic context is constructed from an allowlist and cannot accept arbitrary browser or session data.
- Components render UI, hooks coordinate form and asynchronous state, schemas validate input, and services own data mapping.
- TanStack Query manages asynchronous service state; no global Zustand store is needed.
- Attachments remain out of scope because the repository has no reusable Support upload contract.

## Testing Decisions

- Tests verify observable behavior through schemas, service interfaces, and rendered accessible output rather than private component structure.
- Validation tests cover required issue type, subject, and description.
- Service tests cover documentation filtering, configured and unconfigured contact data, successful and failed submission, duplicate prevention, diagnostic formatting, and secret exclusion.
- Rendering tests cover the four page areas, accessible labels, loading/empty/error states, disabled submission, and copy feedback.
- Existing Vitest and server-rendering conventions from Settings are reused.

## Out of Scope

- Rust endpoints, database schemas, external ticketing integrations, support administration, file uploads, invented documentation articles, and organization-specific contact defaults.

## Further Notes

- The project has no configured issue-tracker workflow, so this PRD is recorded in the repository and cannot be published or labeled `ready-for-agent` automatically.
