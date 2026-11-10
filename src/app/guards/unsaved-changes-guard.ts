
import { CanDeactivateFn } from '@angular/router';
import { EditAttributeComponent } from '../features/attribute/components/edit-attribute/edit-attribute';

export const unsavedChangesGuard: CanDeactivateFn<EditAttributeComponent> =
  (component) => {
    if (!component || typeof component.canDeactivate !== 'function') {
      return true;
    }

    return component.canDeactivate();
  };

// Angular calls this guard when the user tries to leave a route.
// It should fail safely when the target component is missing or has no hook.
