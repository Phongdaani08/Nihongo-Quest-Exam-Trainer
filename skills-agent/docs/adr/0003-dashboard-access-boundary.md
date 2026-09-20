# ADR 0003: Dashboard Access Is Owner or Explicit Share

- Status: Accepted
- Date: 2026-07-24

## Context

Dashboard Access Roles are defined as Owner, Editor, and Viewer relationships
for one Dashboard. The implementation also treated membership in the
Dashboard's Workspace as an implicit Viewer relationship. That fallback made a
revoked share remain accessible, caused the Dashboard Library to show
Dashboards that were never shared with the user, and made the Library query and
sharing model disagree.

## Decision

1. An authenticated user may access a Dashboard only as its Owner or through an
   active explicit Internal Dashboard Share.
2. Workspace membership does not create a Dashboard Access Role.
3. Dashboard Library visibility and direct Dashboard authorization use the same
   Owner-or-explicit-share rule.
4. Revoking an Internal Dashboard Share removes Library visibility and direct
   access immediately.
5. Platform Super Admin does not bypass Dashboard Access Roles merely by
   selecting a Tenant.

## Consequences

- Dashboard access is least-privilege and matches the sharing UI.
- Editor and Viewer actions remain enforced by the existing Dashboard Access
  Role matrix.
- Workspace access remains available for Workspace-scoped features but is not
  a substitute for Dashboard sharing.
- Any future requirement for Workspace-wide Dashboard visibility must be
  represented as an explicit policy rather than a hidden Viewer fallback.

## Rejected Alternatives

### Keep Workspace members as implicit Dashboard Viewers

This makes explicit revoke ineffective and exposes Dashboards that an Owner did
not share.

### Give Platform Super Admin automatic Dashboard access

Platform administration and user-owned content access are separate concerns.
Automatic access would expand privilege beyond the selected Tenant context.
