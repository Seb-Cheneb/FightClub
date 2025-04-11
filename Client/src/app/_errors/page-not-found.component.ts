import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../_environments/client';

@Component({
  selector: 'app-page-not-found',
  imports: [],
  template: `
    <div class="h-screen flex items-center justify-center">
      <span class="font-serif italic text-5xl text-red-600 font-bold"
        >Page not found</span
      >
    </div>
  `,
})
export class PageNotFoundComponent {
  private _router = Inject(Router);

  returnToHomePage() {
    this._router.navigate([Client.home]).then(() => {
      window.location.reload();
    });
  }
}
