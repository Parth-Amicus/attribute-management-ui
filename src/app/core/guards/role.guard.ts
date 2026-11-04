import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastService } from '../services/toast';

export const roleGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    // First check whether the user is logged in
    if (!authService.isLoggedIn) {
        return router.createUrlTree(['/login'], {
            queryParams: {
                returnUrl: state.url
            }
        });
    }

    // Check whether the logged-in user has the Admin role
    if (authService.currentUser?.role === 'Admin') {
        return true;
    }

    // Viewer users are not allowed to access this route
    toastService.show('Access denied');

    return router.createUrlTree(['/attributes']);
};