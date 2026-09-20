# Super Admin Management Integration

## Problem Statement

Platform Super Admin identity and authentication are separated from Tenant
membership, but operators cannot yet list, create, suspend, or reactivate
Platform Super Admins through the product. The Super Admin tenant control page
also loads the legacy Tenant member and role-access representations alongside
the normalized Tenant Roles and Tenant User Management features.

## Solution

Provide a platform-scoped management API and Super Admins page backed by
Platform Administration Grants. Protect the platform from self-suspension and
from losing its final active administrator, including during concurrent
requests. Reuse the normalized Tenant Roles and Tenant User Management
components within Manage Tenant and stop loading the legacy member and
role-access flows there.

## User Stories

1. As a Platform Super Admin, I want to list every Platform Super Admin, so that I can understand who has platform-wide authority.
2. As a Platform Super Admin, I want to search administrators by name or email, so that I can find an account quickly.
3. As a Platform Super Admin, I want to filter active and suspended grants, so that I can review current access.
4. As a Platform Super Admin, I want to create a new administrator identity, so that another operator can administer the platform.
5. As a Platform Super Admin, I want to grant platform access to an existing identity without adding Tenant membership, so that platform authority stays independent from Tenant RBAC.
6. As a newly created Platform Super Admin, I want a secure temporary password when none was supplied, so that I can sign in and replace it.
7. As a Platform Super Admin, I want to suspend another administrator, so that their platform-wide authority is removed immediately.
8. As a Platform Super Admin, I want to reactivate a suspended administrator, so that access can be restored without recreating the account.
9. As a Platform Super Admin, I must not be able to suspend myself, so that accidental lockout is prevented.
10. As the platform, I must retain at least one active Platform Super Admin, so that administration remains recoverable.
11. As the platform, concurrent suspension requests must not bypass last-administrator protection.
12. As a Tenant Admin, I must not access Platform Super Admin routes, so that platform authority remains isolated.
13. As a Platform Super Admin managing a Tenant, I want to use the same Tenant Roles UI as that Tenant, so that permission definitions have one source of truth.
14. As a Platform Super Admin managing a Tenant, I want to use the same Tenant User Management UI as that Tenant, so that memberships and multi-role assignments behave consistently.
15. As an operator, I do not want Manage Tenant to load the legacy Tenant member endpoint, so that old and normalized membership models cannot disagree on screen.
16. As an operator, I do not want Manage Tenant to write legacy role-access JSON, so that Tenant Role permissions remain authoritative.
17. As a security reviewer, I want platform administration changes recorded in the audit log, so that privileged changes are traceable.
18. As an operator, I want management endpoints rate-limited and internal database errors hidden, so that the control plane is safer in production.

## Implementation Decisions

- Expose a dedicated platform administration API for list, create, and status changes.
- Require authenticated Platform Super Admin context for every API operation.
- Store authority only through Platform Administration Grants.
- A create request may attach a grant to an existing active identity or create a new identity without Tenant or Workspace membership.
- Generate temporary passwords from a cryptographically secure random source and require password change for generated credentials.
- Serialize grant status changes with a database advisory transaction lock and recheck the active administrator count inside the transaction.
- Reject self-suspension before performing a status mutation.
- Keep status changes idempotent.
- Record successful create, suspend, and reactivate operations in the audit log.
- Use generic service-unavailable responses for database failures while retaining detailed server logs.
- Build the frontend as repository, hook, page component, and route modules.
- Protect all `/super-admin` routes in the frontend guard and show the Super Admins navigation item only to Platform Super Admins.
- Reuse Tenant Role Configuration and Tenant User Management components with the selected Tenant header.
- Stop preloading the legacy Tenant member endpoint and omit legacy role-access data from the settings update contract.
- Keep the legacy backend endpoints available until PR 3.3 removes remaining consumers.

## Testing Decisions

- Tests verify observable behavior through the management service and frontend repository interfaces.
- Backend integration tests run against PostgreSQL migrations and cover identity creation without Tenant/Workspace membership, filtered listing, self-suspension, suspend/reactivate, and concurrent last-administrator protection.
- Frontend repository tests verify API paths, methods, payloads, and absence of Tenant/Workspace context.
- Frontend component tests verify the Super Admin directory and management actions render.
- Navigation tests verify Tenant users cannot enter any Super Admin route.
- Tenant control integration tests verify legacy member and role-access paths are not preloaded.
- Existing authentication, Tenant RBAC, Tenant User Management, formatting, linting, type checking, and production builds remain regression gates.

## Out of Scope

- Removing legacy admin, Tenant member, and role-access endpoints.
- Removing compatibility role strings from session responses.
- Converging Model, Data Source, Notification, Workspace, and Dashboard authorization.
- Browser E2E infrastructure and GitHub Actions E2E workflows.
- Password reset and email-delivery redesign.

## Further Notes

This work implements the management surface anticipated by ADR 0002. Broader
legacy removal and authorization convergence remain in PR 3.3.
