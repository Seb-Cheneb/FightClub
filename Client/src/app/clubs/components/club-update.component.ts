import { Component, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FighterService } from '../../fighters/fighter.service';
import { ClubService } from '../club.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../_modules/material.module';
import { ClubDto } from '../club';
import { Client } from '../../_environments/client';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-club-update',
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './club-update.component.html',
  styles: ``,
})
export class ClubUpdateComponent {
  clubId = input.required<string>();

  form!: FormGroup;
  club!: ClubDto;

  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _clubService = inject(ClubService);
  private _snackBar = inject(MatSnackBar);

  ngOnInit() {
    this._clubService.getById(this.clubId()).subscribe({
      next: (r) => {
        this.club = r;
        this.updateForm(r);
      },
    });
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      id: new FormControl(this.clubId),
      name: new FormControl(''),
    });
  }

  updateForm(data: ClubDto) {
    this.form.patchValue({
      name: data.name,
    });
  }

  submit() {
    if (this.form.valid) {
      this._clubService.update(this.form.value).subscribe({
        next: () => {
          this.return();
        },
        error: (e) => this._snackBar.open(e, 'close'),
      });
    }
  }

  return() {
    this._router.navigateByUrl(Client.getClubs());
  }
}
