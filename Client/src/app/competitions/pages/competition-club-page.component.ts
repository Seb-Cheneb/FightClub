import { Component, inject } from '@angular/core';
import { CompetitionDto } from '../competition';
import { FighterDto } from '../../fighters/fighter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompetitionService } from '../competition.service';
import { FighterService } from '../../fighters/fighter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../_modules/material.module';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { ClubDto } from '../../clubs/club';
import { ClubService } from '../../clubs/club.service';

@Component({
  selector: 'app-competition-club-page',
  imports: [MaterialModule],
  templateUrl: './competition-club-page.component.html',
  styles: ``,
})
export class CompetitionClubPageComponent {
  competitionId: string = '';
  competition!: CompetitionDto;

  userId: string = '';
  club!: ClubDto;

  fighters: FighterDto[] = [];

  fighterTable: string[] = [
    'name',
    'gender',
    'weight',
    'rank',
    'competition',
    'kumite',
    'kata',
  ];

  private _snackBar = inject(MatSnackBar);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _competitionService = inject(CompetitionService);
  private _fighterService = inject(FighterService);
  private _authService = inject(AuthenticationService);
  private _clubService = inject(ClubService);

  ngOnInit() {
    this.userId = this._authService.userId;
    if (this.userId) {
      this._clubService.getByUserId(this.userId).subscribe({
        next: (r) => {
          this.club = r;
        },
      });
    }

    this.competitionId = String(
      this._activatedRoute.snapshot.paramMap.get('id')
    );

    this._competitionService.getById(this.competitionId).subscribe({
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

  // addFighter(fighterId: string) {
  //   this._competitionService
  //     .addFighter(this.competitionId(), fighterId)
  //     .subscribe({
  //       next: () => {
  //         const fighter = this.fighters.find((i) => i.id == fighterId);
  //         if (
  //           fighter &&
  //           !this.competitionFighters.some((f) => f.id == fighter.id)
  //         ) {
  //           this.competitionFighters = [...this.competitionFighters, fighter];
  //         }
  //       },
  //       error: (error) => this._snackBar.open(error, 'close'),
  //     });
  // }

  // removeFighter(fighterId: string) {
  //   this._competitionService
  //     .removeFighter(this.competitionId(), fighterId)
  //     .subscribe({
  //       next: () => {
  //         this.competitionFighters = this.competitionFighters.filter(
  //           (f) => f.id !== fighterId
  //         );
  //       },
  //       error: (error) => this._snackBar.open(error, 'close'),
  //     });
  // }
}
