# ADR 0001: Tenant-scoped multi-role RBAC

- Status: Superseded by ADR 0005
- Date: 2026-07-23

## Context

Tenant authorization previously stored one role string on `tenant_memberships` and a role-to-permission JSON document on `tenant_settings`. This prevented multiple roles, made permissions ambiguous across Tenants, and caused Dashboard Editor access to fail when the legacy `member` role lacked `dashboard:write`.

The existing global `roles` tables represent the older workspace model and cannot safely express roles whose definitions differ by Tenant. Dashboard Owner, Editor, and Viewer are resource access relationships and must not become Tenant Roles.

## Decision

Create normalized `tenant_roles`, `tenant_role_permissions`, and `tenant_user_roles` tables. Assignments carry the Tenant id and are constrained to a membership and a role from that same Tenant.

Effective Tenant Permissions are the union of every assigned role in the active Tenant. Admin is a protected system role that grants all present and future permissions. User is a protected system role with configurable standard permissions. Platform Super Admin remains separate and bypasses Tenant permission lookup.

Keep legacy membership and JSON policy fields temporarily. Database triggers provision system roles, translate legacy membership changes, and mirror Role Access JSON changes while the old control-plane UI is still deployed.

The temporary compatibility bridge was removed by ADR 0004 after all known
consumers moved to normalized Tenant Roles.

## Consequences

- Users can hold multiple Tenant Roles without expanding session/JWT role claims.
- Permission changes take effect per request and remain isolated by active Tenant.
- Dashboard actions require both Tenant permission and Dashboard resource access.
- The compatibility bridge adds temporary migration complexity.
- A later PR must move Tenant Role/User APIs and UI to the normalized tables, then remove the legacy bridge and columns.
