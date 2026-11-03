import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast';
import { catchError, finalize, retry, throwError, timer } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => { //req is the outgoing http req and next is the next interceptor in the chain or the backend if there are no more interceptors

  const router = inject(Router);
  const toastService = inject(ToastService);

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

  console.log(`Request Started: ${req.method} ${req.urlWithParams}`);
  console.log(`X-Request-Id: ${requestId}`);
  const response = next(modifiedRequest);

  // Retry only GET requests, maximum 2 times, with a 1-second delay
  const retriedResponse = req.method === 'GET'? response.pipe(retry({count: 2,delay: () => timer(1000)})): response;

  return retriedResponse.pipe(

  catchError(error => {

    if (error.status === 401) {
      toastService.show('Your session has expired. Please log in again.');
      void router.navigate(['/login']);
    }

    if (error.status === 500) {
      toastService.show('Something went wrong on the server. Please try again later.');
    }

    return throwError(() => error);
  }),

  finalize(() => {
    const duration = Date.now() - startTime;

    console.log(
      `Request Completed: ${req.method} ${req.urlWithParams} - ${duration}ms`
    );
  })
);
};