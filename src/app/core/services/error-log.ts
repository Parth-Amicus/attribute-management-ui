import { Injectable, signal } from '@angular/core';

export interface ErrorLogEntry {
  timestamp: Date;
  source: string;
  message: string;
  status?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {
  readonly entries = signal<readonly ErrorLogEntry[]>([]);

  log(error: unknown, source: string, status?: number): void {
    const entry: ErrorLogEntry = {
      timestamp: new Date(),
      source,
      message: this.getMessage(error),
      ...(status === undefined ? {} : { status })
    };

    this.entries.update(entries => [entry, ...entries]);
  }

  clear(): void {
    this.entries.set([]);
  }

  private getMessage(error: unknown): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}`;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      const { message } = error;
      if (typeof message === 'string') {
        return message;
      }
    }

    return 'Unknown application error';
  }
}
