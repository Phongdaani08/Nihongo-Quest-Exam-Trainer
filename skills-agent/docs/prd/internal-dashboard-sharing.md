# Internal Dashboard Sharing

## Problem Statement

Dashboard owners can record email invitations and roles, but invited users cannot open or discover the shared Dashboard. Dashboard reads and mutations currently authorize only the owner, while sharing-management endpoints do not verify ownership of the target Dashboard. The UI also infers ownership from mock identifiers instead of an authoritative access role.

## Solution

Introduce one tenant-scoped Dashboard access policy that resolves an authenticated user's Dashboard Access Role and authorizes every Dashboard operation. Bind invitations to existing users in the Dashboard's Tenant, return the resolved access role with Dashboard responses, and use that role to drive Library filters and available actions. Preserve the requested internal Dashboard URL through login.

## User Stories

1. As a Dashboard Owner, I want to invite an existing user in my Tenant as an Editor or Viewer, so that I can collaborate without exposing the Dashboard publicly.
2. As an invited user, I want an internal link to require authentication, so that access is tied to my account.
3. As an invited user, I want to return to the shared Dashboard after login, so that the link completes its intended flow.
4. As a Dashboard Viewer, I want to see the shared Dashboard without edit controls, so that the view is read-only.
5. As a Dashboard Editor, I want to edit and refresh the shared Dashboard, so that I can maintain its content.
6. As a Dashboard Owner, I want exclusive control over deletion and sharing, so that collaborators cannot expand access or destroy the Dashboard.
7. As a user, I want shared Dashboards listed under Shared with you, so that I can discover them again after opening the link.
8. As a user, I want my own Dashboards listed under Yours, so that ownership is represented accurately.
9. As a Tenant administrator, I want Dashboard sharing isolated to one Tenant, so that no invitation crosses the Tenant security boundary.
10. As a Dashboard Owner, I want invitations resolved to real user accounts, so that an email string alone cannot grant access to the wrong identity.
11. As a Dashboard Owner, I want to change or revoke a collaborator's role, so that access can be maintained over time.
12. As a security reviewer, I want every Dashboard endpoint to enforce the same access policy, so that no route bypasses the intended role.

## Implementation Decisions

- Dashboard Access Role is a Dashboard-scoped relationship and is distinct from platform and Tenant roles.
- The roles are Owner, Editor, and Viewer. Ownership remains on the Dashboard; share-member rows contain only Editor or Viewer.
- Owner can view, edit, refresh, delete, and manage sharing. Editor can view, edit, and refresh. Viewer can only view.
- Access resolution is tenant-scoped and centralized behind one backend module interface used by Dashboard and sharing handlers.
- Internal invitations target existing active users who are members of the Dashboard's Tenant and persist their user identity in addition to normalized email.
- Dashboard list responses include the caller's access role and capabilities. Library filters use that role rather than comparing an owner identifier with a mock value.
- Sharing-management operations require Dashboard ownership even when the caller has a broader platform dashboard permission.
- Internal links retain the normal Dashboard URL. Authentication redirects preserve only validated relative return paths.
- Existing unresolved email-only invitations are retained during migration but grant no access until they can be bound to a user identity.

## Testing Decisions

- Tests exercise observable authorization through the Dashboard access and service interfaces rather than private helper structure.
- Backend coverage includes Owner, Editor, Viewer, uninvited user, cross-Tenant user, invitation binding, role change, revocation, and the sharing-management capability rule.
- Frontend coverage includes Yours/Shared filtering, capability-based actions, and safe post-login return paths.
- PostgreSQL-backed integration tests are the preferred seam for access queries; pure capability rules receive fast unit coverage.

## Out of Scope

- Public Dashboard token hardening and Public Dashboard rendering.
- Sharing a chat preview before it has a persisted Dashboard UUID.
- Pending invitations for users who do not yet have an AI GenBI account.
- Email delivery of invitation notifications.
- Transferring Dashboard ownership.

## Further Notes

The issue-tracker publishing step could not run in the current workspace because no issue-tracker client is installed. This checked-in PRD is the fallback source for implementation and later publication.
