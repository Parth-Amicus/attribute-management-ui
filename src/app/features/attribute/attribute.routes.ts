
import { Routes } from '@angular/router';

import { AttributeListComponent } from './components/attribute-list/attribute-list';
import { AddAttributeComponent } from './components/add-attribute/add-attribute';
import { EditAttributeComponent } from './components/edit-attribute/edit-attribute';
import { authGuard } from '../../core/guards/auth.guard';

export const ATTRIBUTE_ROUTES: Routes = [
  {
    path: '',
    component: AttributeListComponent
  },
  {
    path: 'add',
    component: AddAttributeComponent,
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    component: EditAttributeComponent,
    canActivate : [authGuard]
  }
];
