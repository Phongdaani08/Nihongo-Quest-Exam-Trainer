# ADR 0008: Persist query artifacts as the chart source of truth

- Status: Accepted
- Date: 2026-07-30

## Context

Chat previously had two independent chart producers. The deterministic query
result renderer created one chart, while the presenter model could append a
free-form `<chart>` block containing another chart and an untrusted refresh
binding. The two outputs could disagree, render twice, or pin SQL and source
metadata invented by the model. Query results also lacked durable lineage
connecting a pinned panel to the guarded execution that produced it.

## Decision

1. SQL generation returns a typed Query Intent alongside SQL. The contract is
   domain-neutral and names SELECT output aliases used as dimensions,
   measures, supporting fields, filters, ranking, time range, series, and a
   chart hint. The Backend validates this mapping against the executed result.
2. A successful guarded execution creates one immutable Query Artifact from
   the actual source, rewritten SQL, physical relations, result, inferred
   result schema, validated Query Intent, and authenticated Agent Run context.
3. The System Database persists the Query Artifact before the completed Agent
   trace is made available for later replay. Artifact reads are Tenant- and
   Conversation-owner-scoped.
4. A typed Visualization Spec belongs to the Query Artifact. The initial spec
   is deterministically mapped from validated Query Intent, so supporting
   numeric fields cannot silently replace the requested measure. Clients may
   select compatible category and measure fields and only chart types supported
   by both the result schema and the shared renderer.
5. The presenter model returns prose only. It does not emit chart markup, SQL,
   source identifiers, or refresh bindings. Legacy `<chart>` blocks are
   stripped when old conversations are replayed.
6. Chat uses the same Dashboard Chart Renderer used by authenticated and public
   Dashboard views.
7. Pinning copies the Query Artifact id and derives the refresh binding only
   from the persisted artifact. Existing panel lineage and refresh bindings
   must survive when another panel is added to a Dashboard.
8. Legacy `QueryResult` steps and Query Artifacts remain readable, but
   new Agent Runs emit Query Artifacts.

## Consequences

- One query displays one chart, with no competing model-generated chart.
- Pinned panels have auditable execution lineage and a safe refresh binding.
- Chart type choices are limited to implemented renderers and compatible data
  shapes rather than accepting arbitrary visualization names.
- Query Artifact snapshots increase System Database storage; retention and
  snapshot-size policy can be introduced separately without changing the
  lineage contract.
- Dashboard polling, layout editing, and advanced Power BI-like configuration
  remain separate concerns built on this artifact boundary.

## Rejected Alternatives

### Keep chart JSON inside the final answer

This keeps visualization and refresh metadata untyped, unvalidated, and under
model control, and preserves the duplicate-chart failure mode.

### Persist only SQL on a Dashboard panel

SQL alone does not identify the authenticated execution, source, result schema,
or visualization contract and cannot provide complete audit lineage.

### Build another chart renderer only for Chat

A separate renderer would let Chat and Dashboard display the same
Visualization Spec differently and would recreate two sources of truth.
