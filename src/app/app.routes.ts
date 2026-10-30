
import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found';


//Works on first match
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'attributes',
    pathMatch: 'full'
  },
  {
    path: 'attributes',
    loadChildren: () =>
      //Angular loads these files when the user visits /attributes
      import('./features/attribute/attribute.routes')
        .then(module => module.ATTRIBUTE_ROUTES)
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
