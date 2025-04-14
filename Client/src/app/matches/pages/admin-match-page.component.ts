import { Component, inject, input } from '@angular/core';
import { CompetitionService } from '../../competitions/competition.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../_modules/material.module';
import { CompetitionDto } from '../../competitions/competition';
import { FighterDto } from '../../fighters/fighter';
import { FighterService } from '../../fighters/fighter.service';

@Component({
  selector: 'app-admin-match-page',
  imports: [MaterialModule],
  templateUrl: './admin-match-page.component.html',
  styles: ``
})
export class AdminMatchPageComponent {
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
