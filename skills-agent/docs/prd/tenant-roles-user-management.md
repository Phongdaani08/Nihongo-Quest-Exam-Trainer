# Tenant-scoped Roles and User Management

## Problem Statement

Roles and User Management currently operate on global workspace records. Tenant administrators can neither define roles that belong only to their Tenant nor assign several Tenant Roles to one user safely. The Roles page also selects a role automatically and its Jump to control scrolls instead of limiting the visible permission category.

## Solution

Make the existing Roles and User Management experiences use the active Tenant as their security boundary. Tenant administrators manage protected system roles, custom roles, membership lifecycle, and multi-role assignments through normalized Tenant RBAC tables. The Roles page keeps its role list on the left, leaves the right panel blank until a role is selected, and filters the permission table to one category when Jump to is selected.

## User Stories

1. As a Tenant Admin, I want to see only roles from my active Tenant, so that another Tenant's policy is never exposed.
2. As a Tenant Admin, I want every Tenant to have protected Admin and User roles, so that baseline access remains available.
3. As a Tenant Admin, I want to create, rename, configure, and delete Custom Tenant Roles, so that access reflects my organization.
4. As a Tenant Admin, I want invalid permission codes rejected atomically, so that a partially saved role cannot exist.
5. As a Tenant Admin, I want to see only users belonging to my active Tenant, so that account administration is isolated.
6. As a Tenant Admin, I want to invite an existing or new user into my Tenant, so that accounts can participate without duplication.
7. As a Tenant Admin, I want to assign several roles to one user, so that Effective Tenant Permissions are their union.
8. As a Tenant Admin, I want to suspend a Tenant Membership, so that other Tenant memberships and the global account remain unaffected.
9. As a Tenant Admin, I want to remove a user from my Tenant, so that all role assignments in that Tenant are removed.
10. As a Tenant Admin, I want the final active Admin protected, so that the Tenant cannot become unmanageable.
11. As a Roles-page user, I want no role preselected, so that the permission panel stays blank until I make an explicit choice.
12. As a Roles-page user, I want Jump to to show only one permission category, so that large matrices are easier to review.
13. As a Tenant Admin, I want the established User Directory layout retained, so that Tenant RBAC does not unexpectedly replace the administration workflow.
14. As a Tenant Admin, I want Platform Super Admin accounts excluded from Tenant User Management, so that platform operators cannot be modified as Tenant members.
15. As a Platform Super Admin, I want Roles and User Management available only after selecting Manage Tenant, so that every Tenant mutation has an explicit Tenant context.
16. As a Platform Super Admin, I do not want standalone Roles and User Management links in my sidebar, so that platform and Tenant administration remain distinct.

## Implementation Decisions

- Reuse the existing Role Management API paths while changing their implementation to normalized Tenant Role storage.
- Resolve Tenant context from authenticated request context; never accept Tenant id from a mutation payload.
- Keep Platform Super Admin bypass separate from Tenant Roles.
- Add Tenant Membership Status instead of changing the global user status.
- Keep global account password reset and Platform Super Admin administration outside Tenant User Management.
- Return all permission codes for the Admin system role while keeping its matrix read-only.
- Preserve the legacy membership role only as a rollout compatibility field; normalized role assignments remain authoritative.
- Keep standalone Roles and User Management navigation for Tenant Admins only.
- Reuse the same tenant-scoped Roles and User Management components inside the Platform Super Admin Manage Tenant view by passing the selected Tenant context.
- Preserve the established User Directory presentation while replacing its global account operations with Tenant membership and multi-role operations.
- Exclude Platform Super Admin accounts at the Tenant User Management repository boundary and reject direct mutation attempts against them.

## Testing Decisions

- PostgreSQL integration tests exercise tenant isolation and multi-role assignment through public service interfaces.
- Existing Tenant RBAC and Dashboard sharing tests remain regression coverage for Effective Tenant Permissions.
- Frontend service tests cover permission category filtering.
- Frontend navigation tests cover the distinction between Tenant Admin and Platform Super Admin navigation.
- Frontend layout tests preserve the established User Directory structure.
- PostgreSQL integration tests verify Platform Super Admin accounts are neither listed nor mutable through Tenant User Management.
- Full frontend behavior tests, TypeScript, backend tests, Clippy, and production builds are run where dependencies permit.

## Out of Scope

- Platform Super Admin creation UI.
- Password reset by Tenant Admin.
- SSO group mapping.
- Removing legacy global role/workspace tables.

## Further Notes

The issue-tracker connector is not available in this workspace, so this PRD is stored with the codebase for review and publication.
