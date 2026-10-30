
import { CanDeactivateFn } from '@angular/router';  //CanDeactivateFn	Decides whether a user can leave a route
import { EditAttributeComponent } from '../features/attribute/components/edit-attribute/edit-attribute';

export const unsavedChangesGuard: CanDeactivateFn<EditAttributeComponent> =
  component => component.canDeactivate();

  //angular call unsavedChangesGuard when user tries to exit and unsavedChangesGuard calls component.canDeactivate
