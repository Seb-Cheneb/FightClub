import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MaterialModule } from '../../_modules/material.module';
import { CompetitionDto } from '../../competitions/competition';
import { CompetitionService } from '../../competitions/competition.service';
import {
    EditCompetitionFightersComponent
} from '../../competitions/components/edit-competition-fighters.component';
import { EditCompetitionComponent } from '../../competitions/components/edit-competition.component';
import { AddMatchComponent } from '../../matches/components/add-match.component';
import { EditMatchComponent } from '../../matches/components/edit-match.component';
import { MatchService } from '../../matches/match.service';
import { AdminMatchPageComponent } from "../../matches/pages/admin-match-page.component";

@Component({
  selector: 'app-edit-competition-page',
  imports: [
    MaterialModule,
    EditCompetitionComponent,
    AddMatchComponent,
    EditMatchComponent,
    EditCompetitionFightersComponent,
    AdminMatchPageComponent
],
  templateUrl: './edit-competition-page.component.html',
  styles: ``,
})
export class EditCompetitionPageComponent {
  competitionId: string = '';
  competition!: CompetitionDto;

  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _competitionService = inject(CompetitionService);

  ngOnInit() {
    this.competitionId = String(
      this._activatedRoute.snapshot.paramMap.get('id')
    );
    this.getCompetition(this.competitionId);
  }

  getCompetition(id: string) {
    this._competitionService.getById(id).subscribe({
      next: (response) => {
        this.competition = response;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  reloadCurrentRoute() {
    console.log('reloading page');
    const currentUrl = this._router.url;
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
    });
  }
}
