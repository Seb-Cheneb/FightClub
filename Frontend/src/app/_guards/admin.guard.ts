import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Client } from '../_environments/client';
import { AuthenticationService } from '../authentication/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  // canActivate(): Observable<boolean> {
  //   return this.authService.isAdmin().pipe(
  //     map((isAdmin: boolean) => {
  //       if (isAdmin) {
  //         return true;
  //       } else {
  //         console.log('Thou shalt not pass!');
  //         this.router.navigate([ClientUri.getUnauthorizedAccessError()]);
  //         return false;
  //       }
  //     }),
  //     catchError((error) => {
  //       console.error('Error checking admin status:', error);
  //       return of(false);
  //     })
  //   );
  // }
  canActivate(): boolean {
    return true;
  }
}
