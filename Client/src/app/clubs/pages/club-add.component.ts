import { Component, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaterialModule } from '../../_modules/material.module';
import { ClubService } from '../club.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../_environments/client';

@Component({
  selector: 'app-club-add',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './club-add.component.html',
  styles: ``,
})
export class ClubAddComponent {
  form!: FormGroup;
  userId: string = '';

  private _formBuilder = inject(FormBuilder);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  private _clubService = inject(ClubService);

  ngOnInit() {
    this.userId = String(this._activatedRoute.snapshot.paramMap.get('id'));
    this.createForm();
  }

  createForm() {
    this.form = this._formBuilder.group({
      appUserId: new FormControl(this.userId),
      clubName: new FormControl(''),
    });
  }

  submit() {
    if (this.form.valid) {
      this._clubService.add(this.form.value).subscribe({
        next: () => this._router.navigateByUrl(Client.getClubs()),
        error: (e) => this._snackBar.open(e, 'close'),
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  cancel() {
    this._router.navigateByUrl(Client.getClubs());
  }
}
