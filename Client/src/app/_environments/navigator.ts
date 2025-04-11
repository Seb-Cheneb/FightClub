import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from './client';

@Injectable({
  providedIn: 'root',
})
export class Navigator {
  private _router = inject(Router);

  getHome(delay: number) {
    setTimeout(() => {
      this._router.navigate([Client.home]).then(() => {
        window.location.reload();
      });
    }, delay);
  }
}
