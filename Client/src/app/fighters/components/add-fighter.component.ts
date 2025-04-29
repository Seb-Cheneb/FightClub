import { Component, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Client } from '../../_environments/client';
import { MaterialModule } from '../../_modules/material.module';
import { FighterService } from '../fighter.service';
import { FighterDto } from '../fighter';
@Component({
  selector: 'app-add-fighter',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './add-fighter.component.html',
})
export class AddFighterComponent {
  clubId = input.required<string>();
  output = output<FighterDto>();

  form!: FormGroup;

  private _service = inject(FighterService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.createForm(this.clubId());
  }

  createForm(clubId: string) {
    this.form = this._formBuilder.group({
      name: new FormControl(''),
      gender: new FormControl(''),
      birthDate: new FormControl(''),
      weight: new FormControl(''),
      clubId: new FormControl(clubId),
      rank: new FormControl(''),
    });
  }

  submit() {
    if (this.form.valid) {
      this._service.add(this.form.value).subscribe({
        next: (r) => this.output.emit(r),
        error: (e) => this._snackBar.open(e, 'close'),
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
