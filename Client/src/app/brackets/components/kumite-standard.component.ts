import { Component, inject, input, OnInit } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_modules/material.module';
import { BracketDto, PositionDto } from '../bracket';
import { BracketService } from '../bracket.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Logger } from '../../shared/logger';
import { FighterService } from '../../fighters/fighter.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-kumite-standard',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './kumite-standard.component.html',
  styleUrls: ['./kumite-standard.component.scss'],
})
export class KumiteStandardComponent implements OnInit {
  bracket = input.required<BracketDto>();
  positions: PositionDto[] = [];
  selectedFighters: (FighterDto | undefined)[] = Array(16).fill(undefined); // index 1–15 used
  loading = false;

  private _className = 'KumiteStandardComponent';
  private logger = new Logger(this._className);
  private _bracketService = inject(BracketService);
  private _fighterService = inject(FighterService);
  private _snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loading = true;
    this._bracketService.getPositions(this.bracket().id).subscribe({
      next: (response) => {
        this.positions = response;
        this.setSelectedFighters();
      },
      error: (e) => this._snackBar.open(e, 'close'),
      complete: () => (this.loading = false),
    });
  }

  setSelectedFighters() {
    // Create an array to store observables for each fighter fetch
    const fighterObservables: Observable<FighterDto | undefined>[] = [];

    // For each position, create an observable (or use of(undefined) if no fighter at that position)
    for (let i = 1; i <= 15; i++) {
      const fighterId = this.positions.find((p) => p.key === i)?.value;

      if (fighterId) {
        // Add the fighter observable to our array
        fighterObservables[i] = this._fighterService.getById(fighterId).pipe(
          catchError((e) => {
            this._snackBar.open(
              `Error loading fighter at position ${i}: ${e}`,
              'close'
            );
            return of(undefined);
          })
        );
      } else {
        // No fighter at this position
        fighterObservables[i] = of(undefined);
      }
    }

    // Wait for all fighter observables to complete
    forkJoin(fighterObservables.slice(1)).subscribe({
      next: (fighters) => {
        this.logger.log('setSelectedFighters', 'All fighters loaded');

        // Update the selectedFighters array with the resolved fighter objects
        for (let i = 1; i <= 15; i++) {
          if (fighterObservables[i]) {
            fighterObservables[i].subscribe((fighter) => {
              if (fighter) {
                this.selectedFighters[i] = fighter;
                this.logger.log(
                  'setSelectedFighters',
                  `Set fighter ${fighter.name} at position ${i}`
                );
              }
            });
          }
        }
      },
      error: (e) =>
        this._snackBar.open(`Error loading fighters: ${e}`, 'close'),
      complete: () => (this.loading = false),
    });
  }

  onSelectionChange(position: number, fighterId: string | undefined) {
    if (!fighterId) {
      console.warn(
        `${this._className} :: onSelectionChange(position: ${position}, fighter: ${fighterId}) ---> failed to provide a valid fighterId`
      );
      this._bracketService.removePosition(this.bracket().id, position);
      return;
    }

    this._bracketService
      .setFighterPosition(this.bracket().id, fighterId, position)
      .subscribe({
        next: (response) => {
          console.info(
            `${this._className} :: onSelectionChange(position: ${position}, fighter: ${fighterId}) got the following response: `,
            response
          );

          // Update the local fighter data when successful
          this._fighterService.getById(fighterId).subscribe((fighter) => {
            if (fighter) {
              this.selectedFighters[position] = fighter;
            }
          });
        },
        error: (error) => this._snackBar.open(error, 'close'),
      });
  }

  // Use this method for object comparison in the template
  compareWithFn(item1: FighterDto, item2: FighterDto): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }
}
