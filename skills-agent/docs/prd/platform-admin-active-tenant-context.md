# Platform Admin Active Tenant Context

## Problem Statement

Platform Super Admin accounts correctly no longer have fake Tenant
memberships, but Tenant-scoped product APIs require a Tenant context. Without a
selected context, Data Sources, AI Models, and Dashboard Library return access
errors. Dashboard visibility also includes a legacy Workspace Viewer fallback
that conflicts with explicit dashboard sharing.

## Solution

Add a central Active Tenant Context to the existing authenticated session and a
Tenant selector beside search on Tenant Management. Allow only active Platform
Super Admins to select an existing active Tenant. Preserve the session's
original expiry, expose the selected Tenant through the session provider, and
let Tenant-scoped APIs resolve it without creating membership. Converge
Dashboard Library and direct Dashboard access on Owner or Explicit Share.

## User Stories

1. As a Platform Super Admin, I can select an active Tenant from Tenant
   Management.
2. As a Platform Super Admin, my selected Tenant persists across navigation and
   refresh in the current session.
3. As a Platform Super Admin, Data Sources and AI Models show data belonging to
   the selected Tenant.
4. As a Platform Super Admin, selecting a Tenant does not add me as a Tenant or
   Workspace member.
5. As a security reviewer, changing the Active Tenant is audited and does not
   extend session lifetime.
6. As a Dashboard Owner, only I and users I explicitly share with see my
   Dashboard in Library.
7. As a Dashboard Owner, revoking a share removes both Library visibility and
   direct-link access.
8. As a Platform Super Admin, selecting a Tenant does not automatically grant
   access to that Tenant's Dashboards.

## Acceptance Criteria

- The selector lists active Tenants only and displays the session's current
  selection.
- Tenant selection rejects unauthenticated users, non-Platform Admins, missing
  Tenants, and suspended Tenants.
- Redis and in-memory session updates retain their existing expiry.
- Session refresh returns the selected `active_tenant_id`.
- Data Source and AI Model handlers scope queries with the resolved Tenant.
- An explicit Tenant header used by control-plane screens remains a
  request-specific override.
- Dashboard list/get/edit authorization recognizes only Owner or explicit
  Editor/Viewer shares.
- Revoked users receive no Dashboard Access Role even if they remain Workspace
  members.

## Testing Decisions

- Backend integration tests use PostgreSQL migrations and an in-memory session
  store to verify selection, persistence, suspended-Tenant rejection, and
  request-context resolution.
- Frontend service tests verify the dedicated session endpoint contract and
  error propagation.
- Frontend selector tests verify suspended Tenants are excluded.
- Dashboard integration tests verify revoke removes access despite Workspace
  membership.
- Full backend tests, Clippy, formatting, frontend tests, type checking, lint,
  and production build remain regression gates.

## Out of Scope

- Moving the selector to a global sidebar or header.
- Selecting or redesigning Workspace context.
- Giving Platform Super Admins a Dashboard ACL bypass.
- Removing legacy Workspace tables or Workspace roles.
- Browser E2E infrastructure, which remains part of PR 3.4.
