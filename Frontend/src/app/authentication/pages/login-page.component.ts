import { Component } from '@angular/core';
import { MaterialModule } from '../../_modules/material.module';
import { LoginComponent } from '../components/login.component';

@Component({
  selector: 'app-login-page',
  imports: [MaterialModule, LoginComponent],
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {}
