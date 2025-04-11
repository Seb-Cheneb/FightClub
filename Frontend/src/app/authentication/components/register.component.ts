import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Navigator } from '../../_environments/navigator';
import { Client } from '../../_environments/client';
import { CommonModule } from '@angular/common';
import { RegistrationRequest } from '../models/authentication';
import { MaterialModule } from '../../_modules/material.module';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authenticationService = inject(AuthenticationService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private navigator = inject(Navigator);

  public form!: FormGroup;
  public hidePassword = true;

  @Output()
  cancelRegister = new EventEmitter();

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      email: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
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

  register() {
    if (this.form.valid) {
      const formData: RegistrationRequest = this.form.value;

      this.authenticationService.register(formData).subscribe({
        next: () => {
          this.navigator.getHome(200);
        },
        error: () => {
          this.notFound();
        },
      });

      this.router.navigateByUrl(Client.home);
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
    this.router.navigateByUrl(Client.home);
  }

  notFound() {
    this.cancelRegister.emit(false);
    this.router.navigateByUrl('/404');
  }
}
