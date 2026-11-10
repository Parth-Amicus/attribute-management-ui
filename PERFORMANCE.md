# Performance Report — Attribute Management

## 1. Overview

This document records the performance baseline of the Attribute Management application and tracks improvements made during performance optimization.


## 2. Lighthouse Results

The Lighthouse audit will be performed after implementing the performance optimizations.

| Category | Score
|---|---:|
| Performance | 91 |
| Accessibility | 92 |
| Best Practices | 100 | 
| SEO | 82 | 

## 3. Attribute List Refresh and DOM Reuse

The Refresh button reloads the current page, search, and sort from the attributes API. The data table tracks rows by `AttributeId`, rather than by their position or object reference. When an API refresh returns new JavaScript objects for existing attributes, Angular keeps the corresponding row DOM nodes and updates their content. Rows for removed IDs are removed, and rows for new IDs are created.

Without a stable tracking key, refreshing with newly created object instances can cause Angular to recreate row DOM nodes even when the underlying attributes have not changed. Position-based tracking can also reuse a node for the wrong attribute when rows are reordered or replaced. The attribute-list test verifies that a row with an unchanged ID retains its DOM node while its updated content is rendered.

## 4. Virtual Scrolling for Large Attribute Lists

When the API reports more than 50 matching attributes, the list fetches the complete filtered and sorted result set and renders it with Angular CDK's `CdkVirtualScrollViewport`. The fixed-size viewport keeps only the visible rows and a small buffer in the DOM; lists with 50 or fewer attributes continue to use the existing paginated table. The checked-in `db.json` includes 205 attributes, including 197 named `Virtual Scroll Demo Attribute` for trying the feature with `npm run api` and `npm start`.

The attribute-list test generates 205 mock attributes and verifies that the viewport renders 15–20 table rows rather than creating a DOM row for every attribute.

## 5. Production Bundle Optimization

The production bundle was measured with `ng build --stats-json`. The login, dashboard, and not-found routes previously imported their components eagerly. They now use Angular's `loadComponent`, so these pages are loaded on navigation. The attribute routes were already lazy-loaded and remain so. The unused `AsyncPipe` import was also removed from `AttributeListComponent`.

| Browser bundle metric | Before | After | Change |
|---|---:|---:|---:|
| Initial raw size | 398.37 kB | 336.05 kB | −62.32 kB (−15.6%) |
| Initial estimated transfer size | 106.48 kB | 95.23 kB | −11.25 kB (−10.6%) |

After the change, the build emits separate lazy chunks for the routes: login (3.13 kB), dashboard (9.12 kB), and not-found (787 bytes). The larger shared lazy chunk is 47.80 kB. Sizes are raw browser output sizes reported by Angular's production build; transfer estimates are reported separately by the same build.

The three largest module contributions after the change, summed across browser outputs from `browser-stats.json`, are:

| Module | Emitted bytes |
|---|---:|
| Angular core `_debug_node-chunk.mjs` | 141,073 |
| Angular router `_router-chunk.mjs` | 85,314 |
| Angular forms `forms.mjs` | 60,104 |

`webpack-bundle-analyzer` was attempted, but Angular's generated stats use the esbuild metafile format, which the analyzer does not parse as bundles. Module contributions above therefore come directly from Angular's stats (`bytesInOutput`); bundle totals come from the Angular build output.
