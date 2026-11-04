
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast';
import { LoaderComponent } from './shared/components/loader/loader';
import { AuthService } from './core/services/auth';
import { IdleTimeoutService } from './core/services/idle-timeout';

@Component({
  imports: [
    RouterOutlet,
    ToastComponent,
    LoaderComponent
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  standalone: true,
})
export class App {

  protected readonly title = signal('attribute-management-ui');

  // Inject the required services.
  private authService = inject(AuthService);
  private router = inject(Router);
  private idleTimeoutService = inject(IdleTimeoutService);

  // Handles manual logout.
  logout(): void {
    this.idleTimeoutService.stopWatching();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
