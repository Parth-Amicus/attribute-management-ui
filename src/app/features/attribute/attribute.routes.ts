
import { Routes } from '@angular/router';

import { AttributeListComponent } from './components/attribute-list/attribute-list';
import { AddAttributeComponent } from './components/add-attribute/add-attribute';
import { EditAttributeComponent } from './components/edit-attribute/edit-attribute';
import { authGuard } from '../../core/guards/auth.guard';
import { unsavedChangesGuard } from '../../guards/unsaved-changes-guard';
import { attributeResolver } from '../../core/resolvers/attribute.resolvers';

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
    canActivate : [authGuard],
    canDeactivate : [unsavedChangesGuard],
    resolve:{
      attribute: attributeResolver
    }
  }
];
