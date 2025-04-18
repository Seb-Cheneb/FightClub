import { Component, inject, input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

@Component({
  selector: 'app-admin-bracket-page',
  imports: [
    MaterialModule,
    KumiteStandardComponent,
    KumiteTournamentComponent,
    KataComponent,
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
}
