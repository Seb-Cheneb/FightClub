import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Client } from '../_environments/client';
import { AuthenticationService } from '../authentication/authentication.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _authenticationService = inject(AuthenticationService);
  private _router = inject(Router);

  canActivate(): boolean {
    if (this._authenticationService.isLoggedIn) {
      return true;
    } else {
      this._router.navigate([Client.authentication]).then(() => {
        window.location.reload();
      });
      return false;
    }
  }
}
