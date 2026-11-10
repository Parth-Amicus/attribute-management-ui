# Strict TypeScript mode

The shared TypeScript configuration enables `strict`, `noImplicitAny`, and
`strictNullChecks`. The application build passed without weakening types or
using `any` or non-null assertions.

## Five hardest compilation blockers

1. **Authentication service spec imported a nonexistent `Auth` export.**
   Updated the spec to use the service's actual `AuthService` export and type.
2. **Login spec imported a nonexistent `Login` export.**
   Updated it to use `LoginComponent` and provide the router dependency required
   by that component.
3. **Not-found page spec imported a nonexistent `PageNotFound` export.**
   Updated it to use `PageNotFoundComponent` and provide the router required
   by its `RouterLink`.
4. **Toast spec imported a nonexistent `Toast` export.**
   Updated the import and fixture types to the declared `ToastComponent`.
5. **Unsaved-changes guard spec typed a deactivation guard as an activation guard.**
   Changed its type to `CanDeactivateFn<EditAttributeComponent>`, matching the
   guard's four-argument signature and component contract.

These errors were detected while compiling the test target after strict mode
was enabled; correcting the imports and guard signature lets the target
compile without type escapes.
