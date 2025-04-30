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
  userId!: string;
  club!: ClubDto;
  competitionId!: string;
  competition!: CompetitionDto;

  inCompetition: boolean = false;

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
  private _competitionService = inject(CompetitionService);
  private _authService = inject(AuthenticationService);
  private _clubService = inject(ClubService);

  ngOnInit() {
    this.userId = this._authService.userId;
    this.competitionId = String(
      this._activatedRoute.snapshot.paramMap.get('id')
    );

    if (this.userId) {
      this._clubService.getByUserId(this.userId).subscribe({
        next: (r) => {
          this.club = r;
          console.info(`loaded the following club`, this.club);
        },
        error: (e) => this._snackBar.open(e, 'close'),
      });
    } else {
      console.warn(`user id not set`);
    }

    if (this.competitionId) {
      this._competitionService.getById(this.competitionId).subscribe({
        next: (r) => (this.competition = r),
        error: (e) => this._snackBar.open(e, 'close'),
      });
    } else {
      console.warn(`competition id not set`);
    }
  }

  // isFighterInCompetition(id: string) {
  //   this._competitionService
  //     .isFighterInCompetition(this.competitionId, id)
  //     .subscribe({
  //       next: (r) => (this.inCompetition = r),
  //       error: (e) => this._snackBar.open(e, 'close'),
  //     });
  // }

  async isFighterInCompetition(id: string): Promise<boolean> {
    try {
      return await this._competitionService
        .isFighterInCompetition(this.competitionId, id)
        .toPromise();
    } catch (e) {
      console.error(e);
      return false;
    }
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
