import { Component } from '@angular/core';
import { MaterialModule } from '../../_modules/material.module';
import { LoginComponent } from '../components/login.component';
import { RegisterComponent } from '../components/register.component';

@Component({
  selector: 'app-login-page',
  imports: [LoginComponent, RegisterComponent, MaterialModule],
  template: `
    <div class="flex justify-center max-h-full overflow-hidden">
      <mat-tab-group class="w-1/2 h-full overflow-hidden">
        <mat-tab label="Login"> <app-login></app-login> </mat-tab>
        <mat-tab label="Register"> <app-register></app-register></mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class AuthenticationPageComponent {}
