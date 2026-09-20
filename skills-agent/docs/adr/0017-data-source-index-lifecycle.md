# ADR 0017: Separate Data Source provider, metadata, and semantic-index health

## Status

Accepted

## Context

Provider connectivity, cached metadata, and the RAG publication have different
failure modes. A rebuild can fail after provider introspection succeeds, and a
new publication can fail while an older complete publication remains usable.
Using one onboarding status for all three made healthy providers appear failed
and temporarily removed otherwise usable sources from Chat during startup.

## Decision

- `health_status` represents provider connectivity only.
- Metadata and semantic-index lifecycle states are persisted separately.
- Chat accepts a semantic index in `ready` or `degraded` state when a cached
  schema exists and the provider is online. While a replacement is `indexing`,
  Chat may continue on the last-known-good publication only when a recorded
  successful publication exists; first-time indexing remains unavailable.
- Startup computes staleness from the persisted publication fingerprint,
  metadata revision, index version, and schema chunks before changing state.
- A replacement publication remains transactional. Failure retains the prior
  schema chunks and marks the index `degraded`; a first publication failure is
  `failed` and unavailable.
- Index errors exposed through APIs are stable codes and sanitized messages.
  Provider secrets and raw upstream errors are never lifecycle metadata.
- A new backend process may reclaim an `indexing` attempt left by its
  predecessor. Concurrent request-time rebuilds use a bounded lease.

## Consequences

Deployments no longer make every source unavailable while startup checks it.
Operators can distinguish a connection outage from stale metadata or a failed
RAG refresh. A degraded source continues using its last successful index until
a manual retry or subsequent startup rebuild succeeds.
