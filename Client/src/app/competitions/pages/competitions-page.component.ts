import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../_modules/material.module';
import { Client } from '../../_environments/client';
import { CompetitionService } from '../competition.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompetitionDto } from '../competition';

@Component({
  selector: 'app-competitions-page',
  imports: [MaterialModule],
  templateUrl: './competitions-page.component.html',
  styles: ``,
})
export class CompetitionsPageComponent {
  data: CompetitionDto[] = [];
  isLoggedIn: boolean = false;
  isModerator: boolean = false;
  isAdmin: boolean = false;

  private _competitionService = inject(CompetitionService);
  private _authenticationService = inject(AuthenticationService);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.isLoggedIn = this._authenticationService.isLoggedIn;
    this.isModerator = this._authenticationService.isModerator();
    this.isAdmin = this._authenticationService.isAdmin();
    this.getData();
  }

  getData() {
    this._competitionService.getAll().subscribe({
      next: (response) => (this.data = response),
      error: (error) => this._snackBar.open(error, 'close'),
    });
  }

  editCompetition(id: string) {
    this._router.navigateByUrl(Client.editCompetition(id));
  }

  addCompetition() {
    this._router.navigateByUrl(Client.addCompetition());
  }

  manageCompetitionFighters(competitionId: string) {
    this._router.navigateByUrl(Client.manageCompetitionFighters(competitionId));
  }

  viewBrackets(competitionId: string) {
    this._router.navigateByUrl(Client.viewCompetitionBrackets(competitionId));
  }
}
