import { Component, inject, input } from '@angular/core';
import { MaterialModule } from '../../_modules/material.module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { BracketService } from '../bracket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Client } from '../../_environments/client';

@Component({
  selector: 'app-bracket-add',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './bracket-add.component.html',
  styles: ``,
})
export class BracketAddComponent {
  competitionId = input.required<string>();
  form!: FormGroup;

  private _service = inject(BracketService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this._formBuilder.group({
      competitionId: new FormControl(this.competitionId()),
      name: new FormControl(''),
    });
  }

  submit() {
    if (this.form.valid) {
      this._service.add(this.form.value).subscribe({
        next: () => {
          this.openSnackBar('Added entry successfully.', 'Close');
        },
        error: (e) => {
          console.error('Oops, got the following error:', e);
        },
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  cancel() {
    this._router.navigateByUrl(Client.getCompetitions());
  }
}
