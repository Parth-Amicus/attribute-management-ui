# Strict TypeScript mode

The shared TypeScript configuration enables `strict`, `noImplicitAny`, and
`strictNullChecks`, as well as `noImplicitOverride`,
`noPropertyAccessFromIndexSignature`, `noImplicitReturns`, and
`noFallthroughCasesInSwitch`. Angular compiler options also enable strict
injection parameters and strict input access modifiers. These settings are in
`tsconfig.json` and apply to both the app and test projects referenced there.

Run `npm run build` to compile the application and `npm test` to compile and
run the unit tests. Do not disable strict checks to work around a type error;
fix the underlying type or model the optional value explicitly.

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
