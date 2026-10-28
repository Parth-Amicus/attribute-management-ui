import { Routes } from '@angular/router';
import { AttributeListComponent } from './components/attribute-list/attribute-list';
import { AddAttributeComponent} from './components/add-attribute/add-attribute';

export const routes: Routes = [
  { path: '', component: AttributeListComponent }, // no additional path after the domain
  { path: 'add-attribute', component: AddAttributeComponent },
  { path: '**', redirectTo: '' } // if any other redirect to default
];
