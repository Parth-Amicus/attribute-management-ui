
import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

//Works on first match
export const routes: Routes = [
  { //defualt route 
    path: '',
    redirectTo: 'login', //redirects the user to /login
    pathMatch: 'full' //default is prefix and '' is prefix of every path
  },
  {
    path: 'admin/errors',
    canActivate: [authGuard, roleGuard],
    loadComponent: () =>
      import('./features/admin/errors/admin-errors')
        .then(module => module.AdminErrorsComponent)
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
  loadComponent: () =>
    import('./features/dashboard/dashboard').then(module => module.DashboardComponent)
},
{
  path: 'login',
  loadComponent: () =>
    import('./features/auth/login/login').then(module => module.LoginComponent)
},
{
  path: '**',
  loadComponent: () =>
    import('./shared/components/page-not-found/page-not-found')
      .then(module => module.PageNotFoundComponent)
}
];
