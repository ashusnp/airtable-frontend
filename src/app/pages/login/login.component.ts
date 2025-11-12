import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { AirtableAuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
  <div class="login-wrap">
    <mat-card class="card">
      <h2 class="title">Airtable Integration</h2>
      <p class="subtitle">Authenticate with Airtable to continue</p>

      <button mat-raised-button color="primary" class="btn" (click)="connect()">
        <mat-icon>link</mat-icon>&nbsp;Connect to Airtable
      </button>
    </mat-card>
  </div>
  `,
  styles: [`
    .login-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#f6f7fb; }
    .card { width:400px; padding:32px; text-align:center; }
    .title { margin:0 0 8px; }
    .subtitle { color:#666; margin-bottom:24px; }
    .btn { width:100%; }
  `]
})
export class LoginComponent {
  constructor(private auth: AirtableAuthService, private router: Router) {}
  async ngOnInit() {
    this.auth.checkAuth().subscribe({
      next: (user: any) => {
        if (user?.email) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isUserLoggedIn', user.isUserLoggedIn);
          localStorage.setItem('cookieExpiryAt', user.cookieExpiryAt);
          this.router.navigateByUrl('/dashboard');
        } else {
          localStorage.removeItem('user');
          document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
          // this.router.navigateByUrl('/login');
        }

      },
      error: () => {
        localStorage.removeItem('user');
        document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        // this.router.navigateByUrl('/login');
      }
    });

  }
  connect() {
    window.location.href = `${environment.API_BASE_URL}/airtable/auth`;
  }
}
