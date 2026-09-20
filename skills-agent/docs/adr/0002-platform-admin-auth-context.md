# ADR 0002: Separate Platform Administration and Request Contexts

- Status: Accepted
- Date: 2026-07-24

## Context

Platform Super Admin is a platform-wide capability, but the current system
stores it as `tenant_memberships.role = 'super_admin'`. That representation
makes platform access depend on one Tenant and causes Tenant user-management
code to treat a platform operator as a Tenant member.

The request extractor also resolves Identity, Tenant, and Workspace in one
mandatory chain. Consequently, a valid Platform Super Admin cannot perform a
Tenant-only operation unless a Workspace membership also exists.

Password login and Google OAuth independently construct sessions. The duplicate
paths already differ: OAuth implicitly creates a membership in the default
Tenant and ignores several persistence failures.

## Decision

1. Represent Platform Administration as a dedicated grant attached directly to
   a user identity. Its active state is independent of user, Tenant membership,
   and Workspace membership state.
2. Treat authenticated Identity, selected Tenant, and selected Workspace as
   separate request contexts.
3. Require Tenant context for Tenant-scoped operations. A Platform Admin may
   select any existing Tenant; other users require an active membership in an
   active Tenant.
4. Resolve Workspace context only when supplied or when a Workspace-scoped
   endpoint explicitly requires it.
5. Issue all application sessions through one service after the authentication
   provider has established a user identity.
6. Google account creation or linking does not grant Tenant membership.
   Membership is created only by explicit onboarding or invitation.
7. Preserve the current session wire fields during rollout. Backend
   authorization uses an explicit Platform Admin flag as its source of truth.
8. Persist a Platform Admin's selected active Tenant in the existing server-side
   session. Context changes preserve the original session expiry and never
   create Tenant or Workspace membership.

## Consequences

- Platform administrators can operate across Tenants without fake membership
  rows or Workspace access.
- Tenant user-management no longer needs role-string exceptions to discover
  platform identities.
- Workspace-scoped handlers must opt into strict Workspace resolution.
- Existing cached sessions remain readable because the new flag is
  backward-compatible on deserialization.
- Tenant-scoped browser requests consistently resolve the selected Tenant from
  the server-side session, including callers that do not send a Tenant header.
- Explicit Tenant headers remain available for platform control-plane screens
  and override the session selection only for that request.
- Newly authenticated Google users may have no active Tenant and must be routed
  to onboarding rather than silently entering the default Tenant.
- Legacy role values and compatibility triggers can be removed later after all
  consumers converge in PR 3.3.

## Rejected Alternatives

### Keep `super_admin` in every Tenant membership

This duplicates a platform fact across Tenants, creates synchronization and
last-admin ambiguity, and continues leaking platform authorization into Tenant
RBAC.

### Automatically add Platform Admins to every Workspace

This expands persistent access unnecessarily and makes revocation expensive.
Platform bypass should be evaluated at request time, not materialized as many
Workspace memberships.

### Keep separate session builders per provider

Provider-specific session construction will continue to drift in authorization
claims, persistence guarantees, and cookie policy.
