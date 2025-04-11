import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Client } from '../../_environments/client';
import { Navigator } from '../../_environments/navigator';
import { LoginRequest } from '../models/authentication';
import { MaterialModule } from '../../_modules/material.module';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authenticationService = inject(AuthenticationService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private navigator = inject(Navigator);

  public form!: FormGroup;
  public hidePassword = true;

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  login() {
    if (this.form.valid) {
      const formData: LoginRequest = this.form.value;

      this.authenticationService.login(formData).subscribe({
        next: () => this.navigator.navigateWithDelay(Client.home, 200),
        error: () => this.notFound()

      });
    }
  }

  cancel() {
    this.router.navigateByUrl(Client.home);
  }

  notFound() {
    this.router.navigateByUrl(Client.pageNotFoundError);
  }
}
