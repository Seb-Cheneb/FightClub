import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Navigator {
  private _router = inject(Router);

  navigateWithDelay(url: string, delay: number) {
    setTimeout(() => {
      this._router.navigate([url]).then(() => {
        window.location.reload();
      });
    }, delay);
  }
}
