import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { CompetitionDto } from '../competition';
import { CompetitionService } from '../competition.service';
import { MaterialModule } from '../../_modules/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FighterDto } from '../../fighters/fighter';
import { FighterService } from '../../fighters/fighter.service';

@Component({
  selector: 'app-edit-competition-fighters',
  imports: [MaterialModule],
  templateUrl: './edit-competition-fighters.component.html',
  styles: ``,
})
export class EditCompetitionFightersComponent {
  competitionId = input.required<string>();
  competition!: CompetitionDto;
  competitionFighters: FighterDto[] = [];
  fighters: FighterDto[] = [];
  fighterTable: string[] = ['add', 'name', 'gender', 'weight', 'rank', 'club'];
  competitionFighterTable: string[] = ['name', 'club', 'remove'];

  private _snackBar = inject(MatSnackBar);
  private _competitionService = inject(CompetitionService);
  private _fighterService = inject(FighterService);

  ngOnInit() {
    this._competitionService.getById(this.competitionId()).subscribe({
      next: (response) => {
        // get the competition
        this.competition = response;
        // get all fighters
        this._fighterService.getAll().subscribe({
          next: (response) => (this.fighters = response),
          error: (error) => this._snackBar.open(error, 'close'),
        });
        // get competition fighters
        this.getCompetitionFighters(response.fighterIds);
      },
      error: (error) => this._snackBar.open(error, 'close'),
    });
  }

  getCompetitionFighters(fighterIds: string[]) {
    this._fighterService.getAllById(fighterIds).subscribe({
      next: (secondResponse) =>
        (this.competitionFighters = [...secondResponse]),
      error: (error) => this._snackBar.open(error, 'close'),
    });
  }

  addFighter(fighterId: string) {
    this._competitionService
      .addFighter(this.competitionId(), fighterId)
      .subscribe({
        next: () => {
          this.getCompetitionFighters(this.competition.fighterIds);
        },
        error: (error) => this._snackBar.open(error, 'close'),
      });
  }

  removeFighter(fighterId: string) {
    this._competitionService
      .removeFighter(this.competitionId(), fighterId)
      .subscribe({
        next: () => {
          this.getCompetitionFighters(this.competition.fighterIds);
        },
        error: (error) => this._snackBar.open(error, 'close'),
      });
  }
}
