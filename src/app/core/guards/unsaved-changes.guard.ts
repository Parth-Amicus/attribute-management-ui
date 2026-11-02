
import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from './unsaved-changes.interface';

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> =
  (component) => {
    return component.canDeactivate
      ? component.canDeactivate()
      : true;
  };
