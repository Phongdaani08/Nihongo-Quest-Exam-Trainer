# ADR 0004: Compose Tenant, Workspace, and Resource Authorization

- Status: Accepted
- Date: 2026-07-24

## Context

Authorization was split between normalized Tenant Roles and legacy role-name
fields on memberships, Tenant settings, Data Sources, and model policies.
Several consumers still compared Workspace role names or the legacy membership
role with resource policies. This made Custom Tenant Roles unreliable and made
the UI and API enforce different rules.

## Decision

1. Tenant membership answers whether an identity may enter a Tenant.
2. Effective Tenant Permissions are computed only from normalized Tenant Role
   assignments.
3. Model and Data Source visibility uses explicit grants to stable Tenant Role
   ids. Enabled state remains a separate requirement. Every Data Source always
   includes a protected grant to its Tenant's Admin System Tenant Role; User
   and Custom Tenant Role grants remain explicit.
4. Workspace Access Roles control Workspace-scoped actions, including where a
   new Dashboard may be created.
5. Dashboard Owner/Editor/Viewer ACLs remain the only authority over an
   existing Dashboard.
6. Platform Super Admin bypasses Tenant permission and resource-role checks
   only after selecting an active Tenant. It does not bypass Dashboard ACLs.
7. Legacy membership-role, Tenant-settings permission JSON, and resource
   role-name columns are removed only after their values are migrated. The
   migration fails if a configured role cannot be resolved.
8. The Tenant Permission Catalog is Backend-owned metadata. Role-management
   clients render only assignable permissions and do not infer categories or
   behavior from permission-code prefixes.
9. Permission Catalog V2 uses staged activation. Finer-grained permissions
   enter the catalog as Pending: they are not assignable and receive no Role
   grants while runtime consumers still enforce a coarse permission. The
   currently enforced permission remains assignable until an activation
   migration moves its consumers and grants together.
10. The catalog preparation does not silently change authorization behavior.
    ADR 0005 subsequently replaces permission union with one Active Tenant Role
    atomically across sessions, APIs, resource grants, and UI.
11. Data Source management visibility and query availability are separate
    contracts. The management inventory requires `data_source:read` and
    includes Disabled connections. Chat availability requires
    `data_source:query`, an Active Role grant, Enabled state, Ready onboarding,
    and Online health.
12. Conversation Data Source ids are reauthorized immediately before entering
    the Agent/RAG pipeline. A non-empty saved selection fails closed when any
    source is no longer available; an empty selection keeps general Chat
    usable for a Role without Data Source query permission. Schema retrieval
    always filters by the reauthorized ids: omitting a specific Data Source
    means search all reauthorized sources, never an unfiltered RAG search; an
    empty authorized set cannot retrieve schema.
13. Managing Dashboard sharing requires both the effective Tenant permission
    `dashboard:share` and the Dashboard Owner ACL. Tenant permission alone,
    including a Platform Super Admin bypass, never grants sharing authority
    over a Dashboard owned by another user.
14. Disabling a Public Dashboard Share is reversible and retains its token;
    revoking it is permanent. A revoked token is never returned or reactivated,
    and enabling public access again creates a different token.
15. Dashboard mutation requires both the Dashboard ACL and the matching fine-
    grained Tenant Permission: `dashboard:create`, `dashboard:update`,
    `dashboard:refresh`, `dashboard:delete`, or `dashboard:share`.
16. AI Model management inventory and runtime availability are separate
    contracts. `/api/models` requires `model:read`; `/api/models/available`
    requires `model:use`, an enabled Tenant policy, and an Active Tenant Role
    grant. Health checks require `model:manage`, while model execution and Chat
    revalidate `model:use` and the resource grant.

## Consequences

- Custom Tenant Roles work consistently across sessions, Models, Data Sources,
  notifications, Chat, and Dashboard refresh bindings.
- Changing a role assignment is reflected when session details are refreshed.
- Creating a Dashboard requires both Tenant permission and a writable Workspace
  role; editing an existing Dashboard additionally requires its Dashboard ACL.
- Workspace membership does not expose another user's Dashboard.
- API clients keep the `allowed_roles` wire field temporarily, but its values
  are stable Tenant Role ids.
- Permission catalog preparation can deploy without changing authorization:
  Pending permissions remain unavailable until their behavior is true
  end-to-end, and currently enforced permissions remain visible to Role
  administrators.
- Activation migrations must update consumer checks, migrate stored grants,
  make the replacement permissions assignable, and only then deprecate the
  replaced coarse permission.

## Permission Catalog V2 rollout

1. The Permission Catalog preparation change adds metadata and Pending V2
   permissions without changing runtime authorization or stored grants.
2. The Data Source authorization change (PR 3) migrates management and Chat
   consumers to `data_source:read`, `data_source:query`,
   `data_source:create`, `data_source:update`, `data_source:test`,
   `data_source:sync`, `data_source:manage_access`, and
   `data_source:delete`; migrates existing grants; activates those permissions;
   and deprecates the replaced coarse permission only after enforcement.
3. The Dashboard sharing hardening change (PR 5) migrates sharing consumers
   and existing `dashboard:write` grants to `dashboard:share`, then activates
   that permission. `dashboard:write` remains assignable while create, update,
   and refresh consumers still enforce it.
4. The Dashboard authorization rollout migrates create, update, and refresh
   consumers and stored grants before removing `dashboard:write`.
5. The Legacy Permission Cleanup rollout separates AI Model management from
   runtime availability, migrates stored grants, activates all V2 permissions,
   and removes compatibility-only permission codes through a new forward-only
   migration. An upgrade fails before deletion when a Custom Tenant Role still
   holds a compatibility grant without a semantic V2 replacement; an operator
   must explicitly remove or replace that grant. Existing migration files
   remain immutable after release.

## Rejected Alternatives

### Continue synchronizing legacy role-name fields

This retains multiple sources of truth and cannot represent renamed Custom
Tenant Roles safely.

### Collapse Workspace and Dashboard access into Tenant permissions

This would make broad Tenant permissions leak into user-owned resources and
would make explicit Dashboard sharing and revoke semantics unreliable.
