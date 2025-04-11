import { Component } from '@angular/core';
import { NavbarComponent } from './shared/components/navigation/navbar.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent],
  template: ` <app-navbar></app-navbar> `,
})
export class AppComponent {
  title = 'Cerberus';
}
