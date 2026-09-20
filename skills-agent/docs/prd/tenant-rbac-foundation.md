# Tenant RBAC Foundation

## Goal

Replace the single tenant role and JSON permission lookup with normalized, tenant-scoped, multi-role authorization while preserving current users and routes.

## Scope

- Provision protected Admin and User system roles for every existing and future Tenant.
- Allow a user to hold multiple roles per Tenant and different roles across Tenants.
- Resolve effective permissions as the union of all assigned roles in the active Tenant.
- Keep Platform Super Admin as a separate bypass.
- Preserve legacy `tenant_admin`, `member`, and `viewer` memberships during migration.
- Keep the legacy Role Access settings synchronized during the rollout.
- Keep Dashboard Owner, Editor, and Viewer as resource-level access separate from Tenant Roles.

## Out of scope

- Tenant Role and User Management UI.
- Custom-role mutation APIs.
- Replacing legacy role-based model and Data Source allowlists.
- Removing `tenant_memberships.role` or `tenant_settings.role_permissions`.

## System roles

| Internal code | Display name | Behavior |
| --- | --- | --- |
| `tenant_admin` | Admin | Grants all Tenant permissions, including permissions added later |
| `tenant_user` | User | Standard chat and Dashboard permissions; configurable through the compatibility bridge during rollout |

Legacy `viewer` memberships are migrated to a tenant-scoped, read-only `legacy_viewer` custom role so they do not gain User write permissions.

## Authorization rules

1. The request must have an active Tenant context.
2. Platform Super Admin bypasses Tenant permission lookup.
3. Every other user must have a Tenant Membership.
4. A permission is allowed when any assigned role grants it or an assigned role grants all permissions.
5. Role assignments and permissions from other Tenants never contribute.
6. Dashboard operations must also pass the Dashboard Owner/Editor/Viewer policy.

## Acceptance criteria

- Existing members can create/edit/delete their own Dashboards and edit Dashboards shared as Editor.
- Existing viewers remain read-only.
- Tenant Admin and Platform Super Admin retain their current access.
- New Tenants receive Admin and User roles automatically.
- A user can receive a permission from any one of several assigned roles.
- The same user can have different effective permissions in two Tenants.
- Existing Role Access updates continue to affect authorization until the replacement UI ships.
- Existing API signatures and Dashboard sharing routes do not change.

## Verification

- PostgreSQL integration tests cover system-role provisioning, role union, cross-Tenant isolation, legacy migration behavior, compatibility synchronization, and admin bypass.
- Full backend tests, formatting, and Clippy run with all features and warnings denied.
