
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorLogService } from '../services/error-log';
import { ToastService } from '../services/toast';
import { AppStateStore } from '../services/app-state-store';
import { catchError, finalize, retry, throwError, timer } from 'rxjs';

// Keeps track of how many HTTP requests are currently active
let activeRequestCount = 0;

export const httpInterceptor: HttpInterceptorFn = (req, next) => { //req is the outgoing http req and next is the next interceptor in the chain or the backend if there are no more interceptors

  const router = inject(Router);
  const toastService = inject(ToastService);
  const errorLog = inject(ErrorLogService);
  const store = inject(AppStateStore);

  // Generate a unique ID for every HTTP request
  const requestId = crypto.randomUUID();

  // Clone the request because Angular HTTP requests are immutable
  const modifiedRequest: HttpRequest<unknown> = req.clone({
    setHeaders: {
      'X-Request-Id': requestId
    }
  });

  // Record the starting time to calculate request duration
  const startTime = Date.now();

  // Increase the active request count when a request starts
  activeRequestCount++;
  store.setLoading(true);

  console.log(`Request Started: ${req.method} ${req.urlWithParams}`);
  console.log(`X-Request-Id: ${requestId}`);
  const response = next(modifiedRequest);

  // Retry only GET requests, maximum 2 times, with a 1-second delay
  const retriedResponse = req.method === 'GET'
    ? response.pipe(retry({ count: 2, delay: () => timer(1000) }))
    : response;

  return retriedResponse.pipe(

    catchError(error => {
      const status = typeof error?.status === 'number' ? error.status : 0;
      const message = getHttpErrorMessage(status);
      errorLog.log(error, 'HTTP', status);
      toastService.show(message);

      if (status === 401) {
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    }),

    finalize(() => {
      const duration = Date.now() - startTime;

      // Decrease the count when this request finishes
      activeRequestCount--;

      // Hide the loader only when all active requests have completed
      if (activeRequestCount === 0) {
        store.setLoading(false);
      }

      console.log(
        `Request Completed: ${req.method} ${req.urlWithParams} - ${duration}ms`
      );
    })
  );
};

export function getHttpErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request';
    case 401:
      return 'Please log in';
    case 403:
      return 'Access denied';
    case 404:
      return 'Not found';
    default:
      return status >= 500
        ? 'Server error, try again'
        : 'Unable to complete request, try again';
  }
}
