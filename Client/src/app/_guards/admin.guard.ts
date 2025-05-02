import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Client } from '../_environments/client';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private _authenticationService = inject(AuthenticationService);
  private _router = inject(Router);

  canActivate(): boolean {
    if (
      this._authenticationService.isLoggedIn &&
      this._authenticationService.isAdmin()
    ) {
      return true;
    } else {
      this._router.navigate([Client.authentication]).then(() => {
        window.location.reload();
      });
      return false;
    }
  }
}
