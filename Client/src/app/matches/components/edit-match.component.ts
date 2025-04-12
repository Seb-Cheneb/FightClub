import { Component, inject, input, output, signal } from '@angular/core';
import { MatchService } from '../match.service';
import { MatchDto } from '../match';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaterialModule } from '../../_modules/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FighterDto } from '../../fighters/fighter';
import { FighterService } from '../../fighters/fighter.service';
import { CompetitionService } from '../../competitions/competition.service';

@Component({
  selector: 'app-edit-match',
  imports: [MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-match.component.html',
  styles: ``,
})
export class EditMatchComponent {
  id = input.required<string>();
  output = output<void>();
  match!: MatchDto;
  matchFighters: FighterDto[] = [];
  competitionFighters: FighterDto[] = [];
  panelOpenState = signal(false);

  private _snackBar = inject(MatSnackBar);
  private _matchService = inject(MatchService);
  private _fighterService = inject(FighterService);
  private _competitionService = inject(CompetitionService);

  ngOnInit() {
    this.getMatch();
  }

  getMatch() {
    this._matchService.getById(this.id()).subscribe({
      next: (response) => {
        this.match = response;
        this.getMatchFighters(response.fighterIds);
        this.getCompetitionFighters(response.competitionId);
      },
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  getMatchFighters(ids: string[]) {
    this._fighterService.getAllById(ids).subscribe({
      next: (response) => (this.matchFighters = response),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  getCompetitionFighters(id: string) {
    this._competitionService.getById(id).subscribe({
      next: (response) => {
        this._fighterService.getAllById(response.fighterIds).subscribe({
          next: (fighters) => (this.competitionFighters = fighters),
          error: (e) => this._snackBar.open(e, 'close'),
        });
      },
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  deleteMatch(id: string) {
    this._matchService.delete(id).subscribe({
      next: () => this.output.emit(),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  removeFighter(id: string) {
    this._matchService.removeFighter(this.match.id, id).subscribe({
      next: () => this.output.emit(),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  addFighter(id: string) {
    this._matchService.addFighter(this.match.id, id).subscribe({
      next: () => this.output.emit(),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }
}
