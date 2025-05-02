import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompetitionDto } from '../../competitions/competition';
import { CompetitionService } from '../../competitions/competition.service';
import { FighterDto } from '../../fighters/fighter';
import { BracketDto } from '../bracket';
import { BracketService } from '../bracket.service';
import { MaterialModule } from '../../_modules/material.module';
import { KataComponent } from './kata.component';
import { KumiteTournamentComponent } from './kumite-tournament.component';
import { ActivatedRoute } from '@angular/router';
import { FighterListComponent } from '../../fighters/components/fighter-list.component';
import { ViewKumiteStandardComponent } from './view-kumite-standard.component';

@Component({
  selector: 'app-competition-brackets',
  imports: [
    MaterialModule,
    KumiteTournamentComponent,
    ViewKumiteStandardComponent,
    KataComponent,
    FighterListComponent,
  ],
  templateUrl: './competition-brackets.component.html',
  styles: ``,
})
export class CompetitionBracketsComponent {
  competitionId!: string;
  competition!: CompetitionDto;

  brackets: BracketDto[] = [];
  selectedBracket!: BracketDto;
  bracketFighters: FighterDto[] = [];

  private _activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private competitionService = inject(CompetitionService);
  private bracketService = inject(BracketService);

  ngOnInit() {
    this.competitionId = String(
      this._activatedRoute.snapshot.paramMap.get('id')
    );

    this.competitionService.getById(this.competitionId).subscribe({
      next: (competition) => {
        this.competition = competition;
        this.bracketService.getAllById(competition.bracketIds).subscribe({
          next: (brackets) => (this.brackets = brackets),
          error: (error) => this.snackBar.open(error, 'close'),
        });
      },
      error: (e) => this.snackBar.open(e, 'close'),
    });

    this.loadData();
  }

  loadData() {}

  onBracketSelected(bracketId: string) {
    // Reset selectedBracket to force component destruction
    this.selectedBracket = null!;
    this.bracketFighters = [];

    this.bracketService.getById(bracketId).subscribe({
      next: (response) => {
        this.selectedBracket = response;
        this.bracketFighters = response.fighters;
      },
      error: (error) => this.snackBar.open(error, 'close'),
    });
  }
}
