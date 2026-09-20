# Platform Admin and Authentication Foundation

## Problem

Platform Super Admin is currently represented as a special value in
`tenant_memberships.role`. This makes a platform-wide identity depend on a
Tenant record and leaks platform authorization into Tenant user-management
flows. Authentication also has two independent session-issuance paths:
password login and Google OAuth. They can produce different session data and
Google OAuth currently grants a default Tenant membership implicitly.

Tenant-level administration is additionally blocked by Workspace membership
resolution. A Platform Super Admin can select a Tenant but receives an access
error when the account has no Workspace membership in that Tenant, even when
the requested operation does not use a Workspace.

## Solution

Introduce an explicit, suspendable Platform Administration grant that is
independent of Tenant membership. Centralize session issuance for every login
provider, preserve the existing frontend session response contract, and resolve
Identity, Tenant, and Workspace access as distinct authorization contexts.
Tenant-level endpoints must not require a Workspace; endpoints that operate on
Workspace-owned resources must require one explicitly.

## User Stories

1. As a Platform Super Admin, I can authenticate without belonging to the
   default Tenant.
2. As a Platform Super Admin, I can select any existing Tenant for a
   Tenant-level administration operation.
3. As a Platform Super Admin, I am not required to have a Workspace membership
   merely to manage a Tenant.
4. As a Tenant user, I cannot select a Tenant where my membership is missing,
   inactive, or suspended.
5. As a Workspace resource endpoint, I reject a request that has no authorized
   Workspace context.
6. As an operator, I can bootstrap the initial Platform Super Admin without
   creating a fake Tenant membership.
7. As an existing deployment, legacy `super_admin` Tenant memberships are
   migrated to Platform Administration grants without losing administrator
   access.
8. As a user, password and Google authentication produce the same roles,
   permissions, Tenant identifiers, expiry behavior, database session, cache
   session, JWT, and cookie settings.
9. As a new Google-authenticated user, I receive no Tenant membership until an
   explicit onboarding or invitation flow grants one.
10. As the frontend, I continue receiving the current session fields while the
    backend also carries an explicit Platform Admin flag.
11. As a suspended or deleted user, I cannot receive a new session through any
    authentication provider.
12. As an operator, a failure to persist a database or cache session fails the
    login instead of returning a cookie for a partial session.

## Implementation Decisions

- Add migration `0028_platform_admins.sql`.
- Store one Platform Administration grant per user with an active/suspended
  status and audit timestamps.
- Backfill active grants from legacy `tenant_memberships.role = 'super_admin'`,
  then remove those legacy memberships.
- Keep the legacy Tenant role constraint and compatibility code only where
  required for staged rollout; broad legacy removal belongs to PR 3.3.
- Preserve `roles`, `permissions`, `tenant_ids`, and `active_tenant_id` in the
  session payload for frontend compatibility.
- Add `is_platform_admin` to session identity and use it for backend platform
  authorization. The compatibility `super_admin` role string may remain in the
  response during rollout but is not the source of truth.
- Use one session-issuance service after a provider has authenticated or linked
  a user.
- Resolve Tenant context before optional Workspace context. A Workspace header
  is validated if supplied; strict Workspace endpoints opt into a dedicated
  extractor.
- Do not create Tenant or Workspace membership in Google account linking.

## Testing

- Fresh migration creates the Platform Administration relation and indexes.
- Upgrade behavior backfills legacy Platform Super Admins and removes their
  legacy Tenant memberships.
- Repository authorization recognizes only active Platform Administration
  grants.
- Tenant user-management excludes and protects Platform Admin identities.
- A Platform Admin resolves an existing Tenant without a Workspace membership.
- A normal user cannot resolve a Tenant without active membership.
- Workspace-strict extraction rejects a missing or unauthorized Workspace.
- Password and Google flows call the same session issuer.
- A newly created Google user has zero Tenant memberships.
- Formatting, Clippy with warnings denied, backend tests, and migration checks
  pass.

## Out of Scope

- Platform Admin list/create/suspend UI and API (PR 3.2).
- Removal of all legacy admin, member, and role-access APIs (PR 3.3).
- Workspace management UI or redesign of Workspace roles.
- Dashboard ACL convergence and revoke semantics (PR 3.3).
- Browser E2E and dedicated CI infrastructure (PR 3.4).

## Further Notes

Published as GitHub issue
[AI_GenBI#52](https://github.com/somboon-bng/AI_GenBI/issues/52).

This PR deliberately changes the authorization foundation before adding
Platform Admin management screens. Existing Workspace tables and memberships
remain intact. Platform Admin suspension and last-admin protection are modeled
now but exposed through management APIs in PR 3.2.
