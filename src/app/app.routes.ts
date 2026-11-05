
import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';

//Works on first match
export const routes: Routes = [
  { //defualt route 
    path: '',
    redirectTo: 'login', //redirects the user to /login
    pathMatch: 'full' //default is prefix and '' is prefix of every path
  },
{
  path: 'attributes',
  canActivate: [authGuard],
  loadChildren: () =>
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
