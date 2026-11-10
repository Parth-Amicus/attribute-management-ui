# Self-Audit for Assignments 1–3

This audit reviews the work delivered across the first three assignments: route architecture, shared app state, guard/error handling, and the attribute-edit workflow.

## 5 things I did well

1. I created a clean, centralized state layer for the app. The `BehaviorSubject`-based store in `src/app/core/services/app-state-store.ts:15-82` keeps authentication, lookup data, and attributes in one place, which makes state updates predictable and easier to reason about in the UI.
2. I used route guards to protect private pages. The auth flow in `src/app/core/guards/auth.guard.ts:4-18` and the attribute route config in `src/app/features/attribute/attribute.routes.ts:7-30` show that I treated security as an application concern rather than a component concern.
3. I implemented a resolver for edit-page data loading. `src/app/core/resolvers/attribute.resolvers.ts:7-29` fetches the attribute before the edit screen renders, which prevents blank states and keeps the editing flow consistent with the route data model.
4. I kept the app organized by feature and layer. The structure around `src/app/app.routes.ts:7-38` plus the `core`, `shared`, and `features` folders demonstrates a maintainable Angular layout instead of a one-off component-only implementation.
5. I tightened TypeScript safety during the strict-mode pass. The fixes documented in `STRICT-MODE.md:1-21` and the updated guard spec in `src/app/guards/unsaved-changes-guard.spec.ts:1-17` show that I corrected import mismatches and type errors instead of masking them.

## 5 things I would improve

1. Dashboard protection was incomplete. `src/app/app.routes.ts:18-26` allowed `/dashboard` to render without `authGuard`, so a logged-out visitor could still access it. Fix: add `canActivate: [authGuard]` to the dashboard route and keep all app pages behind the same auth policy.
2. The unsaved-changes guard was not defensive enough. `src/app/guards/unsaved-changes-guard.ts:1-13` assumed a component always existed and always had a `canDeactivate()` method. Fix: guard against `null`/missing components and return `true` when no deactivation hook is available.
3. The edit workflow used a hardcoded audit value instead of the current logged-in user. `src/app/features/attribute/components/edit-attribute/edit-attribute.ts:33-177` set `UpdatedBy = 'Current User'`, which breaks audit fidelity. Fix: use `this.authService.currentUser?.username ?? 'Unknown user'` and keep the value synchronized with real auth state.
4. The resolver and edit component did not guard against missing route data. The edit screen assumes `this.route.snapshot.data['attribute']` always exists in `src/app/features/attribute/components/edit-attribute/edit-attribute.ts:58-88`. Fix: validate the resolved attribute before copying it, and redirect to `/attributes` when the item is unavailable.
5. Recent activity was persisted only in browser local storage. `src/app/core/services/activity.ts:12-70` kept history on one browser and could lose it when browser data was cleared. Fix: persist activity through the existing JSON Server API so it can be loaded across sessions and devices that share the server.

## Top 3 improvements applied to the actual code

I implemented the highest-priority fixes in the codebase:

1. Protected the dashboard route with the auth guard in `src/app/app.routes.ts:18-26`.
2. Validated the resolved attribute and switched the audit field to the current authenticated username in `src/app/features/attribute/components/edit-attribute/edit-attribute.ts:58-88` and `src/app/features/attribute/components/edit-attribute/edit-attribute.ts:144-178`.
3. Replaced browser-local activity persistence with the existing JSON Server API and added its `activities` collection in `src/app/core/services/activity.ts:1-91` and `db.json`.



