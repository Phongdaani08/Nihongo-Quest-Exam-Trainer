# ADR 0015: Model Deployments are Platform-owned

- Status: Accepted
- Date: 2026-08-05

## Context

The earlier BYOK implementation let Tenant administrators register provider keys, while current governance allows only Platform Super Admins to add models and then assign Catalog entries to Tenants.

## Decision

Local and BYOK models are stored as Platform-owned Model Deployments and enter the same Platform Model Catalog as system-managed Helix models. Credentials are separate encrypted Platform resources. Tenant Model Allowance, Tenant Model Enablement, and Tenant Resource Role Grants remain separate downstream decisions. Legacy Tenant BYOK endpoints are retired rather than becoming a second model-creation path.

## Consequences

- A Model Deployment has no owning Tenant and cannot grant Tenant access by itself.
- Provider probing happens from the Backend network and returns only sanitized diagnostics.
- Catalog management tests and the **Try on** action resolve the saved deployment at runtime, including encrypted BYOK credentials and Backend-side Local endpoint validation.
- Agent orchestration is a separate runtime consumer; selecting a Tenant default does not by itself reconfigure the currently injected Agent LLM client.
