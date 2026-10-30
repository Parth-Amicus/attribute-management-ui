
import { Routes } from '@angular/router';

import { AttributeListComponent } from './components/attribute-list/attribute-list';
import { AddAttributeComponent } from './components/add-attribute/add-attribute';
import { EditAttributeComponent } from './components/edit-attribute/edit-attribute';

export const ATTRIBUTE_ROUTES: Routes = [
  {
    path: '',
    component: AttributeListComponent
  },
  {
    path: 'add',
    component: AddAttributeComponent
  },
  {
    path: ':id/edit',
    component: EditAttributeComponent
  }
];
