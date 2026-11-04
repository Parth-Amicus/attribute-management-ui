
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, startWith, switchMap, timer, Subject, takeUntil } from 'rxjs';
import { AuthService } from './auth';
import { ToastService } from './toast';

@Injectable({
    providedIn: 'root'
})
export class IdleTimeoutService {

    // 10 minutes expressed in milliseconds.
    private readonly idleTime = 10 * 60 * 1000;

    // Used to stop the activity monitoring subscription.
    private stop$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastService: ToastService
    ) { }

    startWatching(): void {
        // Stop any previous monitoring before starting a new one.
        this.stopWatching();

        // Observe different types of user activity.
        const activity$ = merge(
            fromEvent(document, 'mousemove'),
            fromEvent(document, 'click'),
            fromEvent(document, 'keydown'),
            fromEvent(document, 'scroll'),
            fromEvent(document, 'touchstart')
        );

        activity$.pipe(
            startWith(null),
            switchMap(() => timer(this.idleTime)),
            takeUntil(this.stop$)
        ).subscribe(() => {
            // Log out when the user has been inactive for 10 minutes.
            this.authService.logout();

            this.toastService.show('You have been logged out due to inactivity.');

            this.router.navigate(['/login']);

            this.stopWatching();
        });
    }

    stopWatching(): void {
        this.stop$.next();
    }
}
