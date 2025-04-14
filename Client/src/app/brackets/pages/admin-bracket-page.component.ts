import { Component, inject, input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompetitionDto } from '../../competitions/competition';
import { CompetitionService } from '../../competitions/competition.service';
import { FighterDto } from '../../fighters/fighter';
import { FighterService } from '../../fighters/fighter.service';

@Component({
  selector: 'app-admin-bracket-page',
  imports: [],
  templateUrl: './admin-bracket-page.component.html',
  styles: ``
})
export class AdminBracketPageComponent {
  competitionId = input.required<string>();
  competition!: CompetitionDto; 
  fighters: FighterDto[] = []

  private competitionService = inject(CompetitionService)
  private fighterService = inject(FighterService)
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.competitionService.getById(this.competitionId()).subscribe({
      next: (response1) => {
        this.competition = response1;
        this.fighterService.getAllById(response1.fighterIds).subscribe({
          next: (response2) => this.fighters = response2,
          error: (error) => this.snackBar.open(error, 'close'),
        })
      },
      error: (e) => this.snackBar.open(e, 'close'),
    })
  }
}
