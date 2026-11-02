
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(): void {
    this.authService.login();

    const returnUrl =this.route.snapshot.queryParamMap.get('returnUrl');

    this.router.navigateByUrl(
      returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
        ? returnUrl
        : '/attributes'
    );
  }
}
