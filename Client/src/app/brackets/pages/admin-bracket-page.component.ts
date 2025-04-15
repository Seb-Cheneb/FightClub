import { Component, inject, input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompetitionDto } from '../../competitions/competition';
import { CompetitionService } from '../../competitions/competition.service';
import { FighterDto } from '../../fighters/fighter';
import { FighterService } from '../../fighters/fighter.service';
import { BracketDto } from '../bracket';
import { BracketService } from '../bracket.service';

@Component({
  selector: 'app-admin-bracket-page',
  imports: [],
  templateUrl: './admin-bracket-page.component.html',
  styles: ``,
})
export class AdminBracketPageComponent {
  competitionId = input.required<string>();
  competition!: CompetitionDto;
  brackets: BracketDto[] = [];
  fighters: FighterDto[] = [];

  private competitionService = inject(CompetitionService);
  private bracketService = inject(BracketService);
  private fighterService = inject(FighterService);
  private snackBar = inject(MatSnackBar);

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
}
