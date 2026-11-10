
import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from './unsaved-changes.interface';

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> =
  (component) => {
    if (!component || typeof component.canDeactivate !== 'function') {
      return true;
    }

    return component.canDeactivate();
  };
