import { Component, inject } from '@angular/core';
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
import { CompetitionService } from '../competition.service';

@Component({
  selector: 'app-add-competition',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './add-competition.component.html',
  styles: ``,
})
export class AddCompetitionComponent {
  public form!: FormGroup;

  private _service = inject(CompetitionService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this._formBuilder.group({
      name: new FormControl(''),
      type: new FormControl(''),
      description: new FormControl(''),
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
