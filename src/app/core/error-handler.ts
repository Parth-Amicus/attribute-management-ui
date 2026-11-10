import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorLogService } from './services/error-log';
import { ToastService } from './services/toast';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly errorLog = inject(ErrorLogService);
  private readonly toastService = inject(ToastService);

  handleError(error: unknown): void {
    this.errorLog.log(error, 'Application');
    this.toastService.show('Something went wrong. Please try again.');
  }
}
