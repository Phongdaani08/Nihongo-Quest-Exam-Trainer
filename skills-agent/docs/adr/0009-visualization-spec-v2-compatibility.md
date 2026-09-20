# ADR 0009: Visualization Spec V2 and deterministic compatibility

## Status

Accepted

## Context

Chart choices were duplicated across Chat and Dashboard, persisted Query Artifacts used legacy `bar` and `horizontalBar` identifiers, and compatibility was inferred independently from UI-specific data structures. This allowed unsupported choices to appear available and made field validation dependent on the caller.

## Decision

1. Visualization Spec is a versioned contract. Version 2 uses identifiers from the Canonical Chart Catalog.
2. Every field in a Visualization Spec is validated against the executed Query Artifact result schema. Measures must be numeric.
3. Compatibility is a deterministic module interface returning `compatible`, a stable code, a reason, and a suggested action.
4. Query Artifact and Dashboard panel data use adapters into the same compatibility interface.
5. Legacy `bar` and `horizontalBar` values are accepted at read time and normalized forward to `clustered-column` and `clustered-bar`.
6. Specialized visuals without a production implementation are explicitly incompatible rather than substituted with a different visual.
7. Historical migration files remain immutable; a forward-only migration versions and normalizes stored Query Artifacts.

## Consequences

- Chart selection is predictable across Chat and Dashboard.
- Existing Query Artifacts remain readable while new responses use canonical identifiers.
- Renderer implementation remains a separate concern and can be expanded without changing the persisted contract.
