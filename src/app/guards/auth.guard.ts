import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate: CanActivateFn = () => {
    const isLoggedIn = this.auth.isLoggedIn();

    if (isLoggedIn) {
      // If already logged in and visiting login page, redirect to integrations
      if (location.pathname === '/login') {
        this.router.navigate(['/integrations']);
        return false;
      }
      return true;
    } else {
      // Not logged in → redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  };
}
