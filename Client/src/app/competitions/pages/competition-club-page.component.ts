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
import { BracketDto } from '../../brackets/bracket';
import { BracketService } from '../../brackets/bracket.service';

@Component({
  selector: 'app-competition-club-page',
  imports: [MaterialModule],
  templateUrl: './competition-club-page.component.html',
  styles: ``,
})
export class CompetitionClubPageComponent {
  competitionId!: string;
  clubFighters: FighterDto[] = [];
  competitionFighters: FighterDto[] = [];
  brackets: BracketDto[] = [];

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
  private _authService = inject(AuthenticationService);
  private _bracketService = inject(BracketService);
  private _clubService = inject(ClubService);
  private _competitionService = inject(CompetitionService);
  private _fighterService = inject(FighterService);

  ngOnInit() {
    this.competitionId = String(
      this._activatedRoute.snapshot.paramMap.get('id')
    );

    this._clubService.getByUserId(this._authService.userId).subscribe({
      next: (r) => (this.clubFighters = r.fighters),
      error: (e) => this._snackBar.open(e, 'close'),
    });

    this._competitionService.getById(this.competitionId).subscribe({
      next: (competition) => {
        this._fighterService.getAllById(competition.fighterIds).subscribe({
          next: (r) => (this.competitionFighters = r),
          error: (e) => this._snackBar.open(e, 'close'),
        });
        this._bracketService.getAllById(competition.bracketIds).subscribe({
          next: (r) => (this.brackets = r),
          error: (e) => this._snackBar.open(e, 'close'),
        });
      },
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  isFighterInCompetition(fighter: FighterDto): boolean {
    for (const element of this.competitionFighters) {
      if (element === fighter) {
        return true;
      }
    }
    return false;
  }

  addFighterToCompetition(fighterId: string) {
    this._competitionService
      .addFighter(this.competitionId, fighterId)
      .subscribe({
        next: () => {},
      });
  }

  // isFighterInCompetition(id: string) {
  //   this._competitionService
  //     .isFighterInCompetition(this.competitionId, id)
  //     .subscribe({
  //       next: (r) => (this.inCompetition = r),
  //       error: (e) => this._snackBar.open(e, 'close'),
  //     });
  // }

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
