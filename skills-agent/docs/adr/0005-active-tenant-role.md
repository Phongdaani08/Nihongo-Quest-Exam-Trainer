# ADR 0005: Enforce one Active Tenant Role per session

- Status: Accepted
- Date: 2026-07-26

## Context

A user may hold multiple Tenant Roles, but combining every assigned Role made
least-privilege operation impossible. Selecting a restricted Role still
inherited permissions and resource grants from more privileged Roles. The
Frontend could display one Role while Backend authorization continued to use
the union, so menu visibility, API access, and Chat Data Sources could disagree.

Tenant memberships and Role assignments may also change while a session is
active. Treating the login-time list as authoritative required users to log out
before a new Tenant or revoked Role took effect.

## Decision

1. An ordinary authenticated user exercises exactly one Active Tenant Role in
   the Active Tenant Context. Assigned Roles remain membership facts; selecting
   a Role does not mutate those assignments.
2. Tenant permission checks and Tenant Resource Role Grants use only the stable
   UUID of the Active Tenant Role. Dashboard ACL and Workspace Access remain
   separate authorization layers.
3. Session responses include Assigned Roles, Active Tenant Role, and the
   Effective Tenant Permissions of that Role. Compatibility `roles` contains
   only the Active Tenant Role code.
4. Role selection succeeds only when the Role is assigned to the user in the
   Active Tenant and the Tenant membership remains active. Session mutation is
   compare-and-swap and preserves the existing expiry.
5. Authenticated session refresh revalidates identity, active memberships,
   Assigned Roles, and permissions from the database. A newly assigned Tenant
   appears without a new login.
6. If the Active Tenant Role is withdrawn, fallback is deterministic: protected
   Admin, protected User, then the earliest remaining assignment. With no
   remaining Role, the session stays authenticated but has no Tenant
   permissions until an administrator assigns a Role.
7. Platform Super Admin has no Active Tenant Role. Its explicit platform grant
   continues to bypass Tenant permission and Tenant resource-role checks only
   after selecting an Active Tenant Context.
8. Permission Catalog V2 activation remains staged. Active Role enforcement
   changes which assigned Role contributes currently enforced permissions; it
   does not activate Pending permissions.
9. A successful Role selection rotates the signed session cookie while
   preserving the server-side Session id and expiry. Redis Session state
   remains the authorization source of truth.
10. Clients must invalidate Role-scoped resource caches after selection,
    discard responses from the previous Authorization Scope, and retain only
    Data Source and AI Model selections that remain available. Conversation
    content and unsent prompts are not Role-scoped and must remain intact.

## Consequences

- Switching Role changes Backend authorization, navigation, and resource
  visibility together instead of being a display-only preference.
- Removing a Role or suspending a Tenant membership takes effect on the next
  authenticated request.
- API consumers must carry Active Role context from the validated server-side
  session and must not recompute a union from Role assignments.
- Data Source, Dashboard, and AI Model consumer migrations can add finer-grained
  permissions later without revisiting Active Role semantics.
- Role switching does not require a full-page reload. Resource visibility is
  reconciled independently so the current Conversation remains usable.

## Rejected Alternatives

### Continue using the union of every assigned Role

This prevents users from intentionally operating with reduced privileges and
makes a Role selector misleading.

### Trust a Role id supplied on every request

A request header is easy to forge and would duplicate validation across every
endpoint. The server-side session is the single mutable selection point.

### Persist one Active Role permanently on the user account

Role selection is Tenant-scoped and session-scoped. An account-wide value
cannot represent concurrent sessions in different Tenants safely.
