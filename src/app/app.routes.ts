
import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found';
import { LoginComponent } from './features/auth/login/login';


//Works on first match
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'attributes', //redirects the user to /attributes
    pathMatch: 'full' //default is prefix and '' is prefix of every path
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
  path: 'login',
  component: LoginComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
