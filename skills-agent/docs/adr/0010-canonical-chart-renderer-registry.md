# ADR 0010: Canonical chart renderer registry

## Status

Accepted

## Context

The product catalog exposes 36 canonical Chart types, but the former Dashboard renderer implemented a small set and silently rendered many unrelated types as Line, Bar, Pie, or Table. Dashboard Library previews also used a separate Recharts dispatcher. A caller therefore could not know whether a selected Chart was rendered faithfully, and fixes had to be repeated across Chat, Dashboard, and Public views.

## Decision

1. `DashboardChartRenderer` is the rendering seam for Chat, Dashboard Library previews, Dashboard View/Edit, and Public Dashboard.
2. An exhaustive registry maps all 36 Canonical Chart Types to a concrete renderer family. Missing registrations fail tests and application initialization.
3. The registry builds a renderer model with `ready`, `empty`, or `invalid` status. Unknown types and empty results never become blank or guessed Charts.
4. Graphical Charts use ECharts. Tabular, summary, slicer, Q&A, and deterministic narrative visuals use focused React renderers behind the same seam.
5. Legacy `bar` and `horizontalBar` values remain read-compatible and normalize to canonical identifiers before dispatch.
6. World map geometry is bundled with the application. Map rendering does not send field values to an external tile, geocoding, or analytics provider.
7. Visualization Compatibility remains the gate for user-selectable Chart types; a renderer does not make an incompatible result shape valid.

## Consequences

- Every catalog entry has an explicit implementation and test coverage.
- A Chart type is not silently substituted with a visually unrelated type.
- Rendering behavior and empty/error handling stay consistent across authenticated and public surfaces.
- Bundled world geometry increases the frontend bundle, but removes a runtime network and privacy dependency.
- Interactive cross-visual filtering and advanced authoring controls remain separate configuration concerns.
