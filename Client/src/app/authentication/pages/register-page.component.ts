import { Component } from '@angular/core';
import { MaterialModule } from '../../_modules/material.module';
import { RegisterComponent } from '../components/register.component';

@Component({
  selector: 'app-register-page',
  imports: [MaterialModule, RegisterComponent],
  templateUrl: './register-page.component.html',
  styles: ``,
})
export class RegisterPageComponent {}
