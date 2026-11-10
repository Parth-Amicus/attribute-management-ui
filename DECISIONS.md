# Design decisions

This document records the principal implementation choices and the
alternatives considered.

## 1. Standalone components and route configuration

**Decision:** Use standalone components and route definitions rather than
NgModules.

**Alternatives considered:** Organize features and providers with root and
feature NgModules.

**Reasoning:** This is a new Angular application and does not need to preserve
an NgModule-based legacy structure. Standalone components declare their own
template dependencies, and route-level imports can be lazy-loaded without
module boilerplate.

## 2. Feature/core/shared folder separation

**Decision:** Group business workflows under `features`, app-wide
infrastructure under `core`, and reusable UI under `shared`.

**Alternatives considered:** Organize all components by technical type or put
all code in one flat application folder.

**Reasoning:** Feature folders keep related screens and routes together, while
the core/shared distinction makes the intended reuse and lifetime of code
clearer.

## 3. Lightweight in-memory state store

**Decision:** Use a root-provided `AppStateStore` backed by `BehaviorSubject`
and expose observable state slices.

**Alternatives considered:** Pass state through component inputs, keep
uncoordinated copies in individual components, or add a state-management
library.

**Reasoning:** Attributes, lookup data, loading status, and authentication
state are shared across screens. A small store centralizes updates without
adding another dependency or introducing a larger state framework. The trade
off is that state does not survive a full reload.

## 4. Separate API DTOs from UI models

**Decision:** Convert attribute API records through `MappingService` between
`AttributeDTO` and `IAttribute`.

**Alternatives considered:** Use the API's raw response shape in components,
or change the API to match the UI model.

**Reasoning:** The API uses snake_case fields while the UI model uses
application-oriented property names and `Date` values. Keeping conversion at
the service boundary limits API-shape changes to a small area.

## 5. JSON Server for the local API

**Decision:** Use JSON Server and checked-in `db.json` as the development
backend.

**Alternatives considered:** Hardcode data in components/services, or build a
custom backend for the assignment.

**Reasoning:** A local HTTP API exercises asynchronous loading and CRUD
workflows without coupling UI code to static fixtures. It is a development
backend, not a production persistence or authentication solution.

## 6. Lazy-load route components and the attribute feature

**Decision:** Use `loadComponent` for the login, dashboard, and not-found
pages and `loadChildren` for the attribute route configuration.

**Alternatives considered:** Import all screen components into the root route
table and ship them in the initial application bundle.

**Reasoning:** Screens that are not needed on initial navigation can be
downloaded on demand. The measured production bundle comparison is recorded
in [PERFORMANCE.md](./PERFORMANCE.md).

## 7. SSR at request time with client hydration

**Decision:** Enable server rendering and client hydration, and use
`RenderMode.Server` rather than prerendering every route.

**Alternatives considered:** Client-only rendering or prerendering route
output at build time.

**Reasoning:** Request-time rendering avoids embedding a stale snapshot of
mutable API data into a prerendered page. Client hydration allows Angular to
reuse the server-rendered output in the browser.

## 8. `switchMap` for typeahead search

**Decision:** Switch to the newest search request rather than allowing all
requests to complete concurrently.

**Alternatives considered:** Merge all search requests or serialize them.

**Reasoning:** A new search supersedes the old one; cancelling the prior
inner subscription prevents a late response from replacing newer results.
The search flow also debounces input and suppresses consecutive duplicate
terms.

## 9. Retry only safe GET requests

**Decision:** The HTTP interceptor retries GET requests but does not
automatically retry mutations.

**Alternatives considered:** Retry every request uniformly or disable retries.

**Reasoning:** Repeating a POST or other mutation without API-level
idempotency guarantees can duplicate or repeat a write. Retrying GET requests
is a safer default for transient failures.

## 10. Virtual scrolling only for large result sets

**Decision:** Use the virtual-scroll viewport when more than 50 matching
attributes are available; retain the paginated table for smaller result sets.

**Alternatives considered:** Render every result in the DOM, or use virtual
scrolling for every list.

**Reasoning:** Virtual scrolling limits DOM work for large lists, while
pagination remains the simpler behavior for smaller lists. The threshold
and tested behavior are described in [PERFORMANCE.md](./PERFORMANCE.md).
