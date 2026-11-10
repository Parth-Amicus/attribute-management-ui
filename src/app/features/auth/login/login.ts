import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UserRole } from '../../../interface/user-role';
import { IdleTimeoutService } from '../../../core/services/idle-timeout';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // forms module is imported to use ngModel for two-way data binding
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
 
  //when user types somethiing these properties will be updated with ngmodel
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router, // used when you want to naviagate 
    private route: ActivatedRoute, // used for getting the info from currently active route 
    private idleTimeoutService: IdleTimeoutService
  ) { }

  login(): void {

    //  avoid case-sensitive login issues
    const enteredUsername = this.username.trim().toLowerCase();

    // Determine the user's role based on hardcoded credentials
    let role: UserRole | null = null;

    if (enteredUsername === 'admin' && this.password === 'admin123') {
      role = 'Admin';
    }
    else if (enteredUsername === 'viewer' && this.password === 'viewer123') {
      role = 'Viewer';
    }

    // Check whether the entered credentials are valid
    if (!role) {
      this.errorMessage = 'Invalid username or password';
      return;
    }

    // Clear any previous error message
    this.errorMessage = '';

    // Store the logged-in user's information
    this.authService.login({
      username: enteredUsername,
      role: role
    }); // passed to auth serviec and auth service will storw it in app state store

    this.idleTimeoutService.startWatching();

    // preserve the existing return URL navigation
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    this.router.navigateByUrl(
      returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
        ? returnUrl
        : '/attributes'
    );
  }
}