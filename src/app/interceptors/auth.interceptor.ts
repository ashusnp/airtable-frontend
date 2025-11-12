import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('github_jwt');

  const cloned = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Clear token first
        localStorage.removeItem('github_jwt');

        // Avoid multiple redirects if already on login
        if (router.url !== '/login') {
          setTimeout(() => router.navigate(['/login']), 0);
        }
      }
      return throwError(() => error);
    })
  );
};
