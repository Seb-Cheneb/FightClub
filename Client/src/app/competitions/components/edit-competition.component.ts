import { Component, inject, input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../_environments/client';
import { MaterialModule } from '../../_modules/material.module';
import { FighterDto } from '../../fighters/fighter';
import { FighterService } from '../../fighters/fighter.service';
import { CompetitionDto } from '../competition';
import { CompetitionService } from '../competition.service';

@Component({
  selector: 'app-edit-competition',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-competition.component.html',
  styles: ``,
})
export class EditCompetitionComponent {
  id = input.required<string>();
  public competition!: CompetitionDto;
  public competitionFighters: FighterDto[] = [];
  public availableFighters: FighterDto[] = [];
  public form!: FormGroup;

  private _service = inject(CompetitionService);
  private _fighterService = inject(FighterService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);

  ngOnInit() {
    this.initializeForm();
    this.getById(this.id());
    this.getAllFighters();
  }

  getById(id: string) {
    this._service.getById(id).subscribe({
      next: (response) => {
        this.competition = response;
        this.updateForm(this.competition);
        this.getCompetitionFighters(this.competition);
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
      type: new FormControl(''),
      description: new FormControl(''),
      fighters: new FormControl(''),
      matches: new FormControl(''),
    });
  }

  updateForm(data: CompetitionDto) {
    this.form.patchValue({
      name: data.name,
      type: data.type,
      description: data.description,
      fighters: data.fighterIds,
      matches: data.matchIds,
    });
  }

  submit() {
    if (this.form.valid) {
      this._service.update(this.form.value).subscribe({
        next: () => {
          this.back();
        },
        error: (e) => {
          console.error('Oops, got the following error:', e);
        },
      });
    }
  }

  delete(id: string) {
    this._service.delete(id).subscribe({
      next: () => {
        this.back();
      },
      error: (e) => {
        console.error('Oops, got the following error:', e);
      },
    });
  }

  getAllFighters() {
    this._fighterService.getAll().subscribe({
      next: (response) => {
        this.availableFighters = response;
      },
      error: (e) => {
        console.error('Oops, got the following error:', e);
      },
    });
  }

  getCompetitionFighters(competition: CompetitionDto) {
    competition.fighterIds.forEach((element) => {
      this._fighterService.getById(element).subscribe({
        next: (response) => {
          this.competitionFighters.push(response);
        },
        error: (e) => {
          console.error('Oops, got the following error:', e);
        },
      });
    });
  }

  addFighterToCompetition(id: string) {
    this._service.addFighter(this.competition.id, id).subscribe({
      next: () => {
        this._fighterService.getById(id).subscribe({
          next: (response) => {
            this.competitionFighters.push(response);
          },
          error: (e) => {
            console.error('Oops, got the following error:', e);
          },
        });
      },
      error: (e) => {
        console.error('Oops, got the following error:', e);
      },
    });
  }

  removeFighterFromCompetition(id: string) {
    this._service.removeFighter(this.competition.id, id).subscribe({
      next: () => {
        this.competitionFighters = this.competitionFighters.filter(
          (fighter) => fighter.id !== id
        );
      },
      error: (e) => {
        console.error('Oops, got the following error:', e);
      },
    });
  }

  back() {
    this._router.navigateByUrl(Client.getCompetitions());
  }
}
