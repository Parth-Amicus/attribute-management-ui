import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './error-handler';
import { ErrorLogService } from './services/error-log';
import { ToastService } from './services/toast';

describe('GlobalErrorHandler', () => {
  it('logs unhandled errors and displays a friendly message without exposing details', () => {
    const errorLog = { log: vi.fn() };
    const toastService = { show: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: ErrorLogService, useValue: errorLog },
        { provide: ToastService, useValue: toastService }
      ]
    });

    TestBed.inject(GlobalErrorHandler).handleError(
      new Error('private stack detail')
    );

    expect(errorLog.log).toHaveBeenCalledWith(
      expect.any(Error),
      'Application'
    );
    expect(toastService.show).toHaveBeenCalledWith(
      'Something went wrong. Please try again.'
    );
  });
});
