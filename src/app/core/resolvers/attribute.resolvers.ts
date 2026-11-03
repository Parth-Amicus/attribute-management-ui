
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { AttributeService } from '../services/attribute';
import { ToastService } from '../services/toast';
import { IAttribute } from '../../interface/attribute.interface';

export const attributeResolver: ResolveFn<IAttribute | ReturnType<Router['createUrlTree']>> =
  (route) => {

    const attributeService = inject(AttributeService);
    const toastService = inject(ToastService);
    const router = inject(Router);

    // Get the attribute ID from the URL as a string
    const id = route.paramMap.get('id');

    // Check whether an ID exists
    if (!id) {
      toastService.show('Invalid attribute ID.');
      return router.createUrlTree(['/attributes']);
    }

    // Fetch the attribute from the API
    return attributeService.getAttributeById(id).pipe(
      catchError(() => {
        toastService.show('Attribute not found.');
        return of(router.createUrlTree(['/attributes']));
      })
    );
  };
