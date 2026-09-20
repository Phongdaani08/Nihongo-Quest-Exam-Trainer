# ADR 0007: Resolve one authorized source before SQL execution

- Status: Accepted
- Date: 2026-07-30

## Context

A Conversation may keep several Data Sources selected so users do not need to
change the selector before every question. Semantic-only retrieval can miss
exact table, column, or entity names, while treating all selected sources as
one schema could make the model generate an unsupported cross-source join.
Source selection also must not weaken the existing Active Role authorization
boundary.

Generated SQL needs one production boundary that rejects unsafe or
schema-ungrounded statements before they reach an external provider. Checking
only whether text starts with `SELECT` is insufficient because a SELECT can
contain multiple statements, unknown relations, or dangerous functions.

## Decision

1. The Send Message API accepts the current Selected Data Source Set on every
   message. The Backend authorizes and persists that set before starting a new
   Agent Run.
2. Schema retrieval searches only the authorized selected set and combines
   pgvector semantic candidates with PostgreSQL full-text keyword candidates.
   Reciprocal rank fusion merges both rankings without adding another model or
   tokenizer service.
3. Each data question resolves to exactly one Data Source before SQL
   generation. A clear retrieval winner becomes the Resolved Query Source. If
   multiple sources remain plausible, the Agent persists a clarification and
   asks the user to choose. Cross-source joins are outside this release.
4. SQL generation, validation, repair, and execution remain bound to that same
   source. The Backend ignores model-supplied schema context and uses retrieved
   schema from the resolved source.
5. SQL validation is fail-closed and dialect-aware. It permits one read-only
   SELECT, validates physical tables and directly resolvable columns against
   cached introspection, rejects dangerous functions, and applies complexity,
   result-row, and timeout limits.
6. Tenant, Active Role, resource grant, source lifecycle, and source health are
   revalidated before retrieval and immediately before execution. Every
   execution outcome is audited without credentials or connection strings.
7. Production Data Source accounts remain read-only as defense in depth; the
   application guardrail does not replace provider-level least privilege.

## Consequences

- Users may select several sources while each question still has one
  deterministic execution boundary.
- Exact schema names and natural-language similarity can both contribute to
  retrieval without another inference service.
- Ambiguous cross-source questions pause safely instead of producing guessed
  SQL.
- A source disabled, revoked, suspended, or taken offline after retrieval is
  rejected before execution.
- Provider-specific valid SQL unsupported by the parser is rejected rather
  than executed, which favors safety over permissiveness.
- Federated and cross-source execution requires a separate architecture and is
  not implied by multi-source selection.

## Rejected Alternatives

### Treat every selected source as one virtual schema

This would encourage SQL that no individual provider can execute and obscure
which authorization and credential boundary applies.

### Use semantic retrieval alone

Embedding similarity is useful for intent but can rank exact identifiers
poorly. Full-text matching complements it at low operational cost.

### Trust SQL because it starts with SELECT

Prefix checks do not validate statement count, relation names, columns,
functions, or dialect syntax and therefore fail open.
