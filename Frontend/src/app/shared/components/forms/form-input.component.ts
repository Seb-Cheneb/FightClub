import { Component, Input } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MaterialModule } from '../../../_modules/material.module';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <mat-form-field floatLabel="always" class="w-full">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [type]="type"
        [placeholder]="placeholder"
        [formControl]="control"
      />
      @if (control.invalid && control.touched) {
      <mat-error>{{ getErrorMessage() }}</mat-error>
      }
    </mat-form-field>
  `,
})
export class FormInputComponent {
  @Input() label: string = 'Field';
  @Input() placeholder: string = '';
  @Input() type: string = 'text'; // Default type
  @Input() control!: FormControl;

  getErrorMessage(): string {
    if (!this.control.errors) return '';

    const errors: ValidationErrors = this.control.errors;
    if (errors['required']) {
      return `${this.label} is required.`;
    }
    if (errors['minlength']) {
      const { requiredLength, actualLength } = errors['minlength'];
      return `${this.label} must be at least ${requiredLength} characters long. Currently ${actualLength}.`;
    }
    if (errors['maxlength']) {
      const { requiredLength, actualLength } = errors['maxlength'];
      return `${this.label} must be less than ${requiredLength} characters. Currently ${actualLength}.`;
    }
    if (errors['email']) {
      return `Please enter a valid email address.`;
    }
    return `Invalid value.`;
  }
}
