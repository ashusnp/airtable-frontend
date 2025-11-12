import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const cloned = req.clone({
    withCredentials: true,
  });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Clear token first

        // Avoid multiple redirects if already on login
        if (router.url !== '/login') {
          setTimeout(() => router.navigate(['/login']), 0);
        }
      }
      return throwError(() => error);
    })
  );
};
