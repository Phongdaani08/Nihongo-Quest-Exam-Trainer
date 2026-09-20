# ADR 0012: Enforce idle and absolute session expiry on the backend

## Status

Accepted

## Context

The browser previously used a build-time idle timeout and polled the session
endpoint every 30 seconds. Session refresh also updated `last_activity`, so
polling could keep an abandoned session alive. Separate tabs had independent
timers and could log out an actively used session.

## Decision

1. PostgreSQL session timing is authoritative. Every authenticated validation
   enforces `revoked_at`, an eight-hour `absolute_expires_at`, and the effective
   idle timeout before returning identity data.
2. An ordinary user's effective idle timeout comes from the Active Tenant and
   falls back to the 20-minute Platform default. A Platform Super Admin always
   uses the Platform default, including while operating in a selected Tenant
   context.
3. `GET /api/auth/session` validates and returns timing metadata but never
   updates `last_activity`.
4. `POST /api/auth/activity` is the only browser operation that records real
   user activity. The client sends it on mouse, keyboard, pointer, or scroll
   activity, at most once per 30 seconds while visible. The server also caps
   writes to once per 30 seconds.
5. Background polling, notifications, refreshes, and network traffic do not
   count as user activity.
6. Browser tabs coordinate activity, expiry, Tenant switching, and policy
   changes through `BroadcastChannel`, with `localStorage` as a fallback. A
   short logout lease ensures one tab performs the logout request and then
   broadcasts the outcome.
7. Expiry responses use stable codes and redirect to
   `/session-expired?reason=idle|absolute|revoked`. The UI does not display a
   countdown; backend enforcement remains authoritative if client timers are
   delayed or bypassed.

## Consequences

- Tenant policy changes take effect on the next session validation without a
  redeploy or frontend rebuild.
- Existing signed sessions are rotated to the database absolute deadline when
  next validated.
- Redis and JWT lifetimes may no longer silently extend the absolute session
  lifetime.
- Client-side timers improve UX but cannot weaken backend enforcement.
