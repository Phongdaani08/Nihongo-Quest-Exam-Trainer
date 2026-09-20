# ADR 0011: Persist dashboard visualization drafts as Visualization Spec V2

## Status

Accepted

## Context

Dashboard Edit previously changed only prepared chart arrays and discarded the
Query Artifact id and refresh binding while saving. Chart controls were visible
without a selected Chart, and field, filter, aggregation, sort, and formatting
choices had no durable contract.

## Decision

1. A Dashboard Chart may persist the same Visualization Spec V2 used by its
   Query Artifact.
2. The editor keeps a local Dashboard Visualization Draft and exposes controls
   only for the selected Chart. Cancel restores the original Dashboard; Save is
   the only operation that persists the Draft.
3. Saving preserves Query Artifact id, guarded SQL refresh binding, raw result
   rows, Visualization Spec, and layout together.
4. The Backend validates every persisted Visualization Spec against the linked
   Query Artifact result schema and rejects chart, measure, or dimension drift.
5. Dashboards without a persisted Visualization Spec remain readable. The
   client synthesizes V2 configuration from their existing panel and upgrades
   them on the next successful edit.
6. Owner and Editor authorization remains enforced by Dashboard ACL plus Tenant
   permission. Viewers do not enter edit mode.

## Consequences

- Measure, chart type, aggregation, filter, sort, color, legend, grid, labels,
  and number-format choices survive reload.
- A failed Save leaves Edit mode open and keeps the Draft recoverable.
- Query lineage cannot be silently removed or rebound while editing a Chart.
- Dashboard polling will later rematerialize refreshed rows through this same
  Visualization Spec rather than inventing a second chart contract.
