# Self-audit

This audit checks the current implementation and revisits the earlier findings
in the assignment notes. It is a project-maintenance snapshot, not a security
assessment.

## What is working well

1. **Clear separation of concerns.** `core`, `features`, and `shared` separate
   app infrastructure, business workflows, and reusable UI.
2. **Protected route workflows.** Authentication and role guards protect the
   dashboard, admin errors page, and attribute mutation routes.
3. **Resolved edit data.** The edit route loads its attribute through a
   resolver and redirects to the list when the ID or API lookup fails.
4. **Unsaved-edit handling.** The edit route uses a deactivation guard and the
   guard tolerates a missing component or hook.
5. **Reduced initial route bundle.** Login, dashboard, not-found, and
   attribute routes are loaded on demand; bundle measurements are in
   [PERFORMANCE.md](./PERFORMANCE.md).

## Earlier audit findings and current status

| Earlier finding | Current status |
|---|---|
| Dashboard was not guarded | Resolved: `/dashboard` uses `authGuard`. |
| Deactivation guard assumed a valid component hook | Resolved: the active guard checks for a component and callable `canDeactivate()` hook. |
| Edit audit updates used a hard-coded user label | Resolved for edits: the edit flow uses the authenticated username or `Unknown user`. |
| Edit page assumed resolver data always existed | Resolved: the resolver handles missing IDs and API errors by redirecting to `/attributes`. |
| Recent activity was stored only in browser storage | Resolved: `ActivityService` reads and writes the API's `activities` collection. |

## Remaining improvements

1. **Production API is not configured.** `environment.prod.ts` contains a
   placeholder URL; deployment needs a real API endpoint.
2. **Authentication is demo-level.** The current-user flag is held only in
   memory and the local login flow is not backed by a server-side identity
   provider. It does not persist across reloads.
3. **Create audit attribution is inconsistent.** The add-attribute flow sets
   `UpdatedBy` to the literal `Current User`, while the edit flow uses the
   authenticated username. Use the same identity source for both flows.
4. **Activity failures are only reported to the console.** `ActivityService`
   logs load/save failures with `console.error`; users do not receive a
   dedicated activity-specific error state.
5. **Performance evidence is incomplete.** Bundle comparisons are recorded,
   but the Lighthouse baseline and run environment are missing. See
   [PERFORMANCE.md](./PERFORMANCE.md) before making score-improvement claims.

## Scope note

The project is backed by JSON Server for local development. Its API and
client-side guards are suitable for demonstrating UI workflows, not for
enforcing production authorization or durable data integrity.
