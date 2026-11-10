# Architecture

## Component and route tree

```text
App (root shell)
├── Login                         /login (lazy component)
├── Dashboard                     /dashboard (auth guard, lazy component)
├── AdminErrors                   /admin/errors (auth + role guards)
├── Attribute feature             /attributes (auth guard, lazy routes)
│   ├── AttributeList             /
│   ├── AddAttribute              /add (auth + role guards)
│   └── EditAttribute             /:id/edit (auth + role guards)
│       ├── attributeResolver     Loads the selected attribute before entry
│       └── unsavedChangesGuard   Confirms navigation when edits are pending
└── PageNotFound                  /** (lazy component)

App shell also hosts the shared loader and toast components.
```

The root route redirects to `/login`. Client routes are declared in
`src/app/app.routes.ts`; attribute child routes are in
`src/app/features/attribute/attribute.routes.ts`. The server route configuration
uses request-time server rendering for all paths.

## State management

`AppStateStore` is the in-memory, root-provided state holder. It exposes a
`BehaviorSubject` as a read-only observable and supplies observable slices for
attributes, lookup values, loading status, and authentication. Its setter
methods replace state immutably so subscribers receive a new state value.

Services own data access and update the store where appropriate:

- `AttributeService` reads and writes attributes through the API and maps
  responses to application models.
- `LookupService` loads business units, companies, and locations and stores
  the returned lookup data.
- `AuthService` updates the in-memory authentication flag and current user.
- The HTTP interceptor drives the global loading state for active requests.

Components consume service observables, signals, and store state. This is a
lightweight service/store pattern rather than a separate state-management
library. State is not persisted by `AppStateStore`; the user must sign in again
after a full page reload.

## Services and application infrastructure

Injectable application services below use root scope unless otherwise noted.
`GlobalErrorHandler` and `httpInterceptor` are registered in application
configuration rather than being root-provided services.

| Service / infrastructure | Responsibility |
|---|---|
| `AppStateStore` | Holds shared in-memory state for attributes, lookups, loading, and the current user; exposes observable state slices. |
| `AuthService` | Reads and changes the current authentication state and user via `AppStateStore`. |
| `AttributeService` | Reads, pages, searches, creates, updates, and deletes attributes through the configured API; maps DTOs and synchronizes shared attributes where implemented. |
| `LookupService` | Loads business units, companies, and business-unit-specific customer locations; updates shared lookup state. |
| `MappingService` | Converts API `AttributeDTO` objects to/from the frontend `IAttribute` model. |
| `ActivityService` | Loads and records the latest ten attribute create/update/delete activities through the API. It performs browser-only network work to avoid issuing those requests during server rendering. |
| `IdleTimeoutService` | Watches user interaction and logs the user out after ten minutes of inactivity; displays a toast and navigates to login. |
| `ToastService` | Exposes a signal for the current toast message and manages its auto-dismiss timer. |
| `ErrorLogService` | Keeps an in-memory signal of application and HTTP error entries and supports clearing the log. |
| `GlobalErrorHandler` | Logs uncaught Angular errors and displays a generic error toast. Registered as Angular's `ErrorHandler` in `app.config.ts`. |
| `httpInterceptor` | Adds a request ID, tracks active-request loading, retries GET requests, logs and reports HTTP failures, redirects on 401, and logs request duration. Registered in `app.config.ts`. |

Other routing infrastructure:

- `authGuard` redirects unauthenticated users to login and preserves the
  requested URL.
- `roleGuard` restricts the admin and attribute mutation routes to the
  `Admin` role.
- `attributeResolver` fetches the edit target before route activation and
  redirects to the list if the ID or lookup fails.
- `unsavedChangesGuard` delegates to the edit component's
  `canDeactivate()` hook. The route uses the implementation under
  `src/app/guards`; a similarly named guard/interface also exists under
  `src/app/core/guards`.

## API and rendering

Development requests use `http://localhost:3000`, configured in
`src/environments/environment.ts`; `npm run api` serves `db.json` using
JSON Server. Production currently has a placeholder API URL in
`src/environments/environment.prod.ts`, which must be replaced before
deployment. `MappingService` keeps the API's snake_case DTO separate from the
frontend's TypeScript model.

The Angular application is configured for server-side rendering and client
hydration. Server routes use `RenderMode.Server`, so rendered pages are
generated at request time instead of prerendering a snapshot of mutable API
data.
