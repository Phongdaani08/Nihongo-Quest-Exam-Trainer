# ADR 0016: Tenant LLM Usage is stored as durable invocation events

- Status: Accepted
- Date: 2026-08-07

## Context

Phoenix spans describe Backend observability but the current trace contract does not reliably identify the Tenant, User, Conversation, Agent Run, or one canonical Provider invocation. Tenant Usage must remain isolated and auditable independently of trace export.

## Decision

PostgreSQL LLM Usage Events are the source of truth for Tenant Usage. An event is created before Provider I/O and finalized exactly once as Succeeded, Failed, or Cancelled; incomplete Started events are retained for reconciliation and excluded from reported Usage. Provider-reported token counts are stored exactly or remain unknown. Phoenix remains the trace and debugging system and is not queried as Tenant Usage.

## Consequences

- A Provider call does not start when its Usage Event cannot be created.
- A finalization failure does not turn a successful Provider response into a user-visible failure; finalization is retried and a Started event remains detectable.
- Platform administration probes have no Tenant attribution, even while a Platform Super Admin has selected an Active Tenant.
- Tenant Usage begins at the production migration cutover; older Phoenix traces are not treated as attributable Tenant history.
