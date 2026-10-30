import { Routes } from '@angular/router';
import { AttributeListComponent } from './features/attribute/components/attribute-list/attribute-list';
import { AddAttributeComponent} from './features/attribute/components/add-attribute/add-attribute';
import { EditAttributeComponent } from './features/attribute/components/edit-attribute/edit-attribute';
import { unsavedChangesGuard } from './guards/unsaved-changes-guard';

//WORKS ON FIRST MATCH

export const routes: Routes = [
  { path: '', component: AttributeListComponent }, // no additional path after the domain
  { path: 'add-attribute', component: AddAttributeComponent },
  { path: 'edit-attribute/:id',component: EditAttributeComponent,canDeactivate:[unsavedChangesGuard]}, //id is route parameter

  { path: '**', redirectTo: '' }, // if any other redirect to default
  ];
