# ADR 0006: Revalidate Tenant availability without globally suspending users

- Status: Accepted
- Date: 2026-07-27

## Context

Suspending a Tenant previously blocked Tenant-scoped Backend requests, but an
existing browser session remained authenticated and the Access Denied screen
offered a return to Chat. This produced a redirect loop and obscured the reason
access had ended.

A user may belong to more than one Tenant, while a Platform Super Admin may
select a Tenant without becoming its member. Revoking every affected identity's
sessions when one Tenant is suspended would therefore remove valid access to
other Tenants and incorrectly sign out platform operators.

## Decision

1. Revalidate Tenant availability whenever an authenticated session is
   refreshed.
2. When an ordinary user's Active Tenant becomes unavailable, select another
   active Tenant membership deterministically when one exists.
3. When an ordinary user has memberships but no active Tenant remains, refuse
   new session issuance. An existing browser session is terminated when its
   refreshed session state reaches the client.
4. When a Platform Super Admin's selected Tenant becomes unavailable, clear the
   Active Tenant Context, preserve the authenticated platform session, and
   return the operator to Tenant Management.
5. Treat Tenant Access Unavailable separately from route-level permission
   denial. The user is told to contact an administrator and is never offered a
   route back into Tenant-scoped Chat.
6. Reactivating the Tenant restores eligibility for session issuance without
   recreating memberships or Role assignments.

## Consequences

- Suspending one Tenant takes effect without waiting for the user's next login.
- Multi-Tenant users retain access through another active membership.
- Platform Super Admins remain signed in but must select an active Tenant before
  returning to Tenant-scoped features.
- Existing sessions remain server-side authorization-safe while the browser
  performs logout because every Tenant-scoped request resolves current Tenant
  state from the System Database.
- Direct API clients receive no Tenant context or permissions after suspension,
  even though browser-specific redirect behavior does not apply to them.

## Rejected Alternatives

### Revoke every member session when a Tenant is suspended

This would also terminate valid sessions for users who still belong to another
active Tenant and would require broad Redis session enumeration during a Tenant
control-plane update.

### Keep the session and show a generic Access Denied page

This preserves an unusable authenticated state, encourages a redirect loop back
to Chat, and fails to explain that Tenant availability—not a single route
permission—is the cause.
