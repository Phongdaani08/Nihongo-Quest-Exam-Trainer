# AI Code Review Workflow

> Production-ready workflow for reviewing Backend and Frontend code.

## 1. Purpose

This document defines mandatory coding standards and review criteria to
ensure code is readable, maintainable, secure, testable, and
production-ready.

------------------------------------------------------------------------

# 2. Universal Standards

## 2.1 Naming

### Requirements

-   Names must describe intent.
-   Avoid vague names (`data`, `temp`, `value`, `item`) except tiny
    scopes.
-   Boolean names start with `is`, `has`, `can`, `should`.
-   Use consistent naming across the project.

### Review Checklist

-   [ ] Function names describe behavior
-   [ ] Variable names are meaningful
-   [ ] Boolean names follow convention
-   [ ] Naming is consistent

------------------------------------------------------------------------

## 2.2 Single Responsibility

Each function/component should have one responsibility.

**Rule:** If explaining it requires multiple "and", split it.

Checklist

-   [ ] One responsibility
-   [ ] Business logic separated
-   [ ] Side effects isolated

------------------------------------------------------------------------

## 2.3 Size

-   Function: \~50 lines warning
-   File: \~300--400 lines warning

Review

-   [ ] Long function reviewed
-   [ ] Large file considered for refactor

------------------------------------------------------------------------

## 2.4 Comments

Comment **why**, not **what**.

Good:

``` text
Retry 3 times because gateway often times out during peak hours.
```

Bad:

``` text
Increment count.
```

Checklist

-   [ ] Comments explain intent
-   [ ] No redundant comments

------------------------------------------------------------------------

## 2.5 DRY

Apply Rule of Three.

-   2 duplicates → acceptable
-   3+ duplicates → extract

Avoid over-abstraction.

------------------------------------------------------------------------

# 3. Backend Standards

## 3.1 Layered Architecture

Controller → Validation → Service → Repository → Database

Checklist

-   [ ] No SQL in Controller
-   [ ] Business logic in Service
-   [ ] Repository only accesses DB

------------------------------------------------------------------------

## 3.2 Error Handling

-   Never swallow errors
-   Use typed exceptions
-   Hide internal errors from clients

Checklist

-   [ ] No empty catch
-   [ ] Proper error types
-   [ ] Safe client responses

------------------------------------------------------------------------

## 3.3 Input Validation

Validate all external input.

Checklist

-   [ ] API
-   [ ] Upload
-   [ ] Webhook
-   [ ] Third-party

------------------------------------------------------------------------

## 3.4 Configuration

-   No secrets in source
-   Environment-based configuration
-   No magic numbers

------------------------------------------------------------------------

## 3.5 Database

-   Versioned migrations
-   Rollback supported
-   No direct production schema edits

------------------------------------------------------------------------

## 3.6 API Design

-   Consistent endpoints
-   Versioning
-   Idempotency for critical writes

------------------------------------------------------------------------

# 4. Frontend Standards

## 4.1 Logic vs Presentation

Separate rendering from business logic.

Checklist

-   [ ] Custom hooks
-   [ ] Presentational components
-   [ ] Limited props

------------------------------------------------------------------------

## 4.2 State Management

Single Source of Truth.

Checklist

-   [ ] No duplicated state
-   [ ] Derived values not stored

------------------------------------------------------------------------

## 4.3 UI Consistency

Use design tokens.

Checklist

-   [ ] Shared buttons
-   [ ] Shared modal patterns
-   [ ] No hardcoded colors

------------------------------------------------------------------------

## 4.4 Accessibility

-   Keyboard navigation
-   aria-label
-   WCAG AA

------------------------------------------------------------------------

## 4.5 Performance

-   Avoid unnecessary re-renders
-   Lazy loading
-   Memoize appropriately

------------------------------------------------------------------------

# 5. Team Process

## Git

-   Atomic commits
-   Meaningful commit messages
-   No force push to shared branches

## Code Review

-   At least one reviewer
-   Review correctness + readability

## Testing

-   Unit tests for business logic
-   Tests are readable

## Documentation

README should include

-   Setup
-   Run
-   Architecture

Major decisions should have ADR.

------------------------------------------------------------------------

# 6. Reliability, Observability & Security

## Observability

-   Structured logging
-   Correlation ID / Request ID
-   Centralized logs

## Graceful Shutdown

Backend

-   Finish active requests
-   Close DB connections

Frontend

-   Error Boundary
-   Fallback UI

## Idempotency & Rate Limiting

-   Idempotency Key
-   Rate limiting

## Security

-   Argon2/bcrypt password hashing
-   Never log secrets
-   Input sanitization
-   SQL Injection protection
-   XSS protection

------------------------------------------------------------------------

# 7. Severity

## Critical

Must fix before merge.

## High

Should fix before merge.

## Medium

Fix during current sprint.

## Low

Improvement suggestions.

------------------------------------------------------------------------

# 8. Final Review Output

Every review should include:

-   Summary
-   Strengths
-   Issues
-   Severity
-   Suggested Fixes
-   Pass / Fail

A pull request is considered complete only when:

-   Standards pass
-   Tests pass
-   Documentation updated
-   Review approved
