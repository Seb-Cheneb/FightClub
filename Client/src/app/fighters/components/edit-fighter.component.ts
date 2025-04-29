import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../_environments/client';
import { MaterialModule } from '../../_modules/material.module';
import { FighterDto } from '../fighter';
import { FighterService } from '../fighter.service';

@Component({
  selector: 'app-edit-fighter',
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './edit-fighter.component.html',
})
export class EditFighterComponent {
  public id: string = '';
  public data!: FighterDto;
  public form!: FormGroup;

  private _activatedRoute = inject(ActivatedRoute);
  private _service = inject(FighterService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);

  ngOnInit() {
    this.id = String(this._activatedRoute.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.getById(this.id);
  }

  getById(id: string) {
    this._service.getById(id).subscribe({
      next: (response) => {
        this.updateForm(response);
      },
      error: (e) => {
        console.error('Oops, got the following error:', e);
      },
    });
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      id: new FormControl(this.id),
      name: new FormControl(''),
      gender: new FormControl(''),
      birthdate: new FormControl(''),
      weight: new FormControl(''),
      rank: new FormControl(''),
    });
  }

  updateForm(data: FighterDto) {
    this.form.patchValue({
      name: data.name,
      gender: data.gender,
      birthdate: data.birthdate,
      weight: data.weight,
      rank: data.rank,
    });
  }

  submit() {
    if (this.form.valid) {
      this._service.update(this.form.value).subscribe({
        next: () => {
          this.return();
        },
        error: (e) => {
          console.error('Oops, got the following error:', e);
        },
      });
    }
  }

  return() {
    this._router.navigateByUrl(Client.getClubs());
  }
}
