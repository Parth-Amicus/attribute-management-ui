
import { inject } from '@angular/core';
import {RedirectCommand,ResolveFn,Router} from '@angular/router';

import { AttributeService } from '../services/attribute';
import { ToastService } from '../services/toast';
import { IAttribute } from '../../interface/attribute.interface';

//checks whether the attribute id in the url is valid and if the attribute exists If not it redirects to the attribute list page and shows a toast message
export const attributeResolver: ResolveFn<IAttribute | null> =
  (route) => {
// using inject instead of constructor injection because this is a standalone function, not a class
    const attributeService = inject(AttributeService);
    const toastService = inject(ToastService);
    const router = inject(Router);

    const id = Number(route.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      toastService.show('Invalid attribute ID');
      return new RedirectCommand(router.createUrlTree(['/attributes']));
    }

    const attribute = attributeService.getAttributeById(id);

    if (!attribute) {
      toastService.show('Attribute not found');
      return new RedirectCommand(router.createUrlTree(['/attributes']));
    }

    return attribute;
  };
