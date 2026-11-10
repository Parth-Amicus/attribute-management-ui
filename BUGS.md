# Assignment 2 bug log

The original Assignment 2 submission/report is not present in this repository.
This log records the three bugs and resolutions already described in the
Assignment 2 notes in `README.md`; it does not claim to reproduce an external
submission.

| Bug | Cause and observed behavior | Resolution recorded in the project | Status |
|---|---|---|---|
| Subscription continued after leaving a component | A manually managed subscription was not cleaned up. Navigating away left its interval running; revisiting could create additional active subscriptions. | The README records using `takeUntilDestroyed()` to end the subscription with its component. | Resolved in the assignment notes; the original repro and test are not included here. |
| Search could show stale results | Concurrent search requests could complete out of order, allowing an older result to replace a newer query's result. | The README records replacing `mergeMap()` with `switchMap()` so newer queries supersede prior requests. | Resolved in the assignment notes; the original repro and test are not included here. |
| Late subscribers missed the current state | A plain `Subject` did not replay the most recent emitted value to a subscriber that subscribed later. | The README records replacing it with `BehaviorSubject`, which replays its current value. | Resolved in the assignment notes; the original repro and test are not included here. |

The separate historical issues identified in the project self-audit and their
current disposition are documented in [SELF-AUDIT.md](./SELF-AUDIT.md).
