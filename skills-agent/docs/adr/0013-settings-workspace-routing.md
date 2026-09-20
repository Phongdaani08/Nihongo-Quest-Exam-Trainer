# ADR 0013: Settings Workspace routing and ownership

## Status

Accepted

## Context

Personal Settings was mounted independently by the Sidebar and by the legacy `/profile` page. Administration pages also own their own page shells. Moving those destinations into a modal without a single owner would duplicate state, permission checks, and URL behavior, and could render two Settings dialogs at once.

The migration must remain deployable in stages. A destination whose embedded panel is not ready must continue to use its standalone route rather than appearing as an empty or partially functional tab.

## Decision

- The application Sidebar owns the authenticated Settings Workspace dialog.
- A single registry defines destination ids, groups, legacy routes, safe close paths, implementation readiness, and authorization requirements.
- Only implemented and authorized registry entries are rendered or resolved as Settings destinations.
- Opening Settings from the shell is local and preserves the current URL.
- Selecting another destination uses `router.replace` to add or replace the `settings` query parameter. Replace is intentional: closing Settings must not leave earlier modal tabs behind in browser history.
- Closing a query-driven workspace removes only the `settings` parameter and preserves unrelated query parameters.
- An implemented legacy route may resolve directly to a Settings destination and declares its safe close path. `/profile` is the first migrated legacy route.
- Tenant administration entries reuse their existing feature components inside the workspace. Their standalone menu routes now resolve to the same modal owner and render only a neutral route backdrop, preventing duplicate data loading.
- Platform administration entries reuse the existing Tenant Management and Platform Super Admin feature components inside the workspace. Their legacy menu routes resolve to the same modal owner.
- `/super-admin` is a non-modal Platform landing and the safe close path for Platform administration. This avoids a redirect loop for Platform Super Admins who have not selected an Active Tenant Context and therefore cannot enter Tenant-scoped routes.
- Data Source Detail reuses the same detail panel inside the Settings Workspace. The selected connection is encoded in the `dataSource` query parameter so refresh and bookmarks preserve the view; the legacy nested route redirects to that canonical workspace URL while retaining the existing authorization boundary.

## Consequences

- Settings state and unsaved-change handling have one owner.
- Deep links are refresh-safe and Back/Forward cannot reopen stale intermediate Settings tabs created by in-modal navigation.
- Existing Tenant administration URLs remain valid deep links and authorization continues to run before the workspace is rendered.
- Tenant administration links are removed from the Sidebar once their authorized Settings tabs are enabled, leaving one navigation entry point without removing bookmark compatibility.
- Platform administration links are removed from the Sidebar after their Settings panels migrate, while their legacy URLs remain valid bookmarks.
