import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized-access',
  imports: [],
  template: `
    <div class="h-screen flex items-center justify-center">
      <span class="font-serif italic text-5xl text-red-600 font-bold"
        >Page not found</span
      >
    </div>
  `,
})
export class UnauthorizedAccessComponent {}
