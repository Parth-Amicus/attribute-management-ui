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
