import { Component, inject, input } from '@angular/core';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
  MatSnackBar,
} from '@angular/material/snack-bar';
import { CompetitionDto } from '../../competitions/competition';
import { CompetitionService } from '../../competitions/competition.service';
import { FighterDto } from '../../fighters/fighter';
import { FighterService } from '../../fighters/fighter.service';
import { BracketDto } from '../bracket';
import { BracketService } from '../bracket.service';
import { MaterialModule } from '../../_modules/material.module';
import { KumiteStandardComponent } from '../components/kumite-standard.component';
import { KataComponent } from '../components/kata.component';
import { KumiteTournamentComponent } from '../components/kumite-tournament.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-bracket-page',
  imports: [
    MaterialModule,
    KumiteStandardComponent,
    KumiteTournamentComponent,
    KataComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-bracket-page.component.html',
  styles: ``,
})
export class AdminBracketPageComponent {
  competitionId = input.required<string>();
  competition!: CompetitionDto;
  brackets: BracketDto[] = [];
  fighters: FighterDto[] = [];

  selectedBracket!: BracketDto;
  bracketFighters: FighterDto[] = [];

  private competitionService = inject(CompetitionService);
  private bracketService = inject(BracketService);
  private fighterService = inject(FighterService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // FORM
  form!: FormGroup;
  private _formBuilder = inject(FormBuilder);

  initializeForm() {
    this.form = this._formBuilder.group({
      id: new FormControl(''),
      surface: new FormControl(''),
    });
  }

  updateForm(bracket: BracketDto) {
    this.form.patchValue({
      id: bracket.id,
      surface: bracket.surface,
    });
  }

  submit() {
    if (this.form.valid) {
      this.bracketService.update(this.form.value).subscribe({
        next: () =>
          this.snackBar.open('succesfully updated bracket', 'close', {
            duration: 1000,
          }),
        error: (e) => this.snackBar.open(e, 'close'),
      });
    }
  }
  // END OF FORM

  ngOnInit() {
    this.competitionService.getById(this.competitionId()).subscribe({
      next: (competitionResp) => {
        this.competition = competitionResp;
        this.bracketService.getAllById(competitionResp.bracketIds).subscribe({
          next: (bracketResp) => (this.brackets = bracketResp),
          error: (error) => this.snackBar.open(error, 'close'),
        });
        this.fighterService.getAllById(competitionResp.fighterIds).subscribe({
          next: (fighterResponse) => (this.fighters = fighterResponse),
          error: (error) => this.snackBar.open(error, 'close'),
        });
      },
      error: (e) => this.snackBar.open(e, 'close'),
    });
  }

  onBracketSelected(bracketId: string) {
    this.bracketService.getById(bracketId).subscribe({
      next: (bracketResponse) => {
        this.selectedBracket = bracketResponse;
        this.bracketFighters = bracketResponse.fighters;
        this.initializeForm();
        this.updateForm(bracketResponse);
        // this.fighterService.getAllById(bracketResponse.fighterIds).subscribe({
        //   next: (fighterResponse) => (this.bracketFighters = fighterResponse),
        //   error: (error) => this.snackBar.open(error, 'close'),
        // });
      },
      error: (error) => this.snackBar.open(error, 'close'),
    });
  }

  addFighter(bracketId: string, fighterId: string) {
    this.bracketService.addFighter(bracketId, fighterId).subscribe({
      next: () => {
        this.fighterService.getById(fighterId).subscribe({
          next: (fighterResponse) => {
            this.bracketFighters = [...this.bracketFighters, fighterResponse];
          },
          error: (error) => this.snackBar.open(error, 'close'),
        });
      },
      error: (error) => this.snackBar.open(error, 'close'),
    });
  }

  removeFighter(bracketId: string, fighterId: string) {
    this.bracketService.removeFighter(bracketId, fighterId).subscribe({
      next: () => {
        this.fighterService.getById(fighterId).subscribe({
          next: () => {
            this.bracketFighters = this.bracketFighters.filter((i) => {
              return i.id !== fighterId;
            });
          },
          error: (error) => this.snackBar.open(error, 'close'),
        });
      },
      error: (error) => this.snackBar.open(error, 'close'),
    });
  }

  deleteBracket(id: string) {
    this.bracketService.delete(id).subscribe({
      next: () => {
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([window.location.pathname]);
          });
      },
      error: (error) => this.snackBar.open(error, 'close'),
    });
  }
}
