## Problem Statement

AI GenBI currently stores Appearance, Notification Preferences, and the editable Account display name in browser-local state. These Personal Settings do not follow the authenticated user across browsers or devices and cannot be treated as durable account data.

## Solution

Persist Personal Settings in PostgreSQL behind authenticated Rust APIs and replace the browser-local frontend implementation with the existing typed Settings service boundary. Appearance and Notification Preferences live in a one-to-one user settings record. Account identity continues to use the existing users record. Email remains read-only and avatar upload remains unavailable.

## User Stories

1. As an authenticated user, I want to load my Personal Settings, so that every device shows the same saved choices.
2. As an authenticated user, I want to save my theme, so that AI GenBI remembers my preferred appearance.
3. As an authenticated user, I want to save my language, so that AI GenBI remembers my preferred locale.
4. As an authenticated user, I want to enable or disable email notifications, so that my delivery consent is durable.
5. As an authenticated user, I want to enable or disable in-app notifications, so that my delivery consent is durable.
6. As an authenticated user, I want to update my display name, so that my account identity is current.
7. As an authenticated user, I want to see my account email and avatar URL without being able to edit unsupported fields.
8. As an authenticated user, I want invalid settings rejected, so that corrupt values are not stored.
9. As an authenticated user, I want only my own settings returned and changed, so that account data remains isolated.
10. As a user without an active workspace, I want to manage Personal Settings, so that account preferences do not depend on tenant membership.
11. As a frontend developer, I want stable typed service operations, so that UI components do not depend on HTTP details.

## Implementation Decisions

- Personal Settings are account-scoped and independent of Tenant Settings.
- One authenticated aggregate read returns Appearance, Notification Preferences, and Account profile.
- Each writable section has an independent update operation so saving one section cannot overwrite another.
- Appearance accepts only light, dark, or system themes and Thai or English languages.
- Notification Preferences initially support email and in-app Boolean channels.
- Account updates accept only a normalized non-empty display name. Email is read-only.
- The existing users image field is returned as the avatar URL. Uploading or changing an avatar is not included.
- Missing user settings are represented by defaults and created lazily on the first update.
- Personal authentication validates the session without requiring tenant context.
- API responses use camelCase at the frontend boundary through an explicit mapping in the Settings service.

## Testing Decisions

- Tests assert public validation and API behavior rather than private helper calls.
- Rust tests cover allowed values, rejected values, normalization, defaults, user isolation, and independent section updates.
- Frontend service tests cover request methods, payload mapping, response mapping, and error behavior.
- Integration verification uses the real PostgreSQL and Redis services through Docker when available.

## Out of Scope

- Password changes, two-factor authentication, and session management.
- Editing account email.
- Avatar upload, file validation, or object storage.
- Sending notifications or creating notification records.
- Tenant or workspace configuration.

## Further Notes

The repository has no configured issue tracker, so this PRD is stored locally as the publication fallback.
