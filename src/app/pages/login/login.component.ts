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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
      },
    });
  }
  connect() {
    window.location.href = `${environment.API_BASE_URL}/airtable/auth`;
  }
}
