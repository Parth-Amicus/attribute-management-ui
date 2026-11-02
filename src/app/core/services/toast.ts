import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
//stores and manages messages 
export class ToastService {
  // message signal accessed by template
  message = signal<string | null>(null);
  
  // keeps track of the active timer so we can reset it if needed
  private timeoutId: any = null;

  show(newMessage: string, durationMs: number = 3000) {
    this.message.set(newMessage);

    //  clear any existing active timer
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set a new timer to automatically clear the message
    this.timeoutId = setTimeout(() => {
      this.clear();
    }, durationMs);
  }

  clear() {
    this.message.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
