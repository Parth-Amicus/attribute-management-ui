
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast';
import { LoaderComponent } from './shared/components/loader/loader';
import { AuthService } from './core/services/auth';
import { IdleTimeoutService } from './core/services/idle-timeout';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActiveStatusDirective } from './shared/directives/active-status';

@Component({
  imports: [ // we need to import ROuterOutelt etc because standalone component manage their own depencencies 
    RouterOutlet,
    RouterLink,
    ToastComponent,
    LoaderComponent,
    ActiveStatusDirective
  ],
  selector: 'app-root', // selector is used to identify the component in html
  styleUrl: './app.css',
  templateUrl: './app.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {

  protected readonly title = signal('attribute-management-ui');

  // Inject the required services

  // Using inject() allows for more flexibility in how dependencies are provided and can be used outside of class constructors
  private authService = inject(AuthService);
  private router = inject(Router);
  private idleTimeoutService = inject(IdleTimeoutService);
  //converting an observalbe to a signal 
  currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

  //manual logout function to stop idle timeout and logout the user
  logout(): void {
    this.idleTimeoutService.stopWatching();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
