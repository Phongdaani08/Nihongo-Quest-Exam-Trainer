# ADR 0014: Separate Platform Model Catalog governance from Tenant enablement

- Status: Accepted
- Date: 2026-08-05

## Context

AI Model policy used one Tenant `enabled` flag for two different decisions: whether a Platform Super Admin assigned a model to a Tenant and whether that Tenant chose to enable it. This let the platform control plane overwrite Tenant role configuration and made a selected Active Tenant look like the global model catalog.

## Decision

The Platform Model Catalog is platform-scoped and can be viewed by a Platform Super Admin without Active Tenant Context. Platform Super Admins own Tenant Model Allowance through Manage Tenant; Tenant administrators own Tenant Model Enablement and Tenant Resource Role Grants. Runtime model access requires allowance, enablement, and the Active Tenant Role grant. When a Platform Super Admin selects an Active Tenant, the AI Models inventory contains only that Tenant's allowed models; the full Catalog remains available only with no Active Tenant selected.

## Consequences

- Revoking Tenant Model Allowance takes effect immediately without deleting Tenant enablement or role-grant history.
- A Tenant administrator cannot discover or enable an unassigned Catalog model.
- Platform Catalog operations and Tenant model operations require distinct request contexts and authorization extractors.
- Existing enabled Tenant policies are migrated as both allowed and enabled so an upgrade does not remove current access.
