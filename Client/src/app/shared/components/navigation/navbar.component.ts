import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Client } from '../../../_environments/client';
import { MaterialModule } from '../../../_modules/material.module';
import { AuthenticationService } from '../../../authentication/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [MaterialModule, RouterOutlet],
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  private _authService = inject(AuthenticationService);
  private _router = inject(Router);

  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit() {
    this.isLoggedIn = this._authService.isLoggedIn;
  }

  getHomePage() {
    this._router.navigateByUrl(Client.home);
  }

  register() {
    this._router.navigateByUrl(Client.register());
  }

  login() {
    this._router.navigateByUrl(Client.login());
  }

  logout() {
    this._authService.logout();
    setTimeout(() => {
      this._router.navigateByUrl(Client.home).then(() => {
        window.location.reload();
      });
    }, 200);
  }

  getFighters() {
    this._router.navigateByUrl(Client.getFighters());
  }

  addFighter() {
    this._router.navigateByUrl(Client.addFighter());
  }

  getCompetitions() {
    this._router.navigateByUrl(Client.getCompetitions());
  }

  addCompetition() {
    this._router.navigateByUrl(Client.addCompetition());
  }
}
