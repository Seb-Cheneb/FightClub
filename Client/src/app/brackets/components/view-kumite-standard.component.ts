import { Component, inject, input, OnInit } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_modules/material.module';
import { BracketDto, PositionDto } from '../bracket';
import { BracketService } from '../bracket.service';
import { FighterService } from '../../fighters/fighter.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-view-kumite-standard',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './view-kumite-standard.component.html',
  styleUrls: ['./view-kumite-standard.component.scss'],
})
export class ViewKumiteStandardComponent implements OnInit {
  bracket = input.required<BracketDto>();
  positions: PositionDto[] = [];
  selectedFighters: (FighterDto | undefined)[] = Array(16).fill(undefined);
  loading = false;

  private _bracketService = inject(BracketService);
  private _fighterService = inject(FighterService);

  ngOnInit() {
    this.loading = true;
    this._bracketService.getPositions(this.bracket().id).subscribe({
      next: (response) => {
        this.positions = response;
        this.setSelectedFighters();
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false),
    });
  }

  private setSelectedFighters() {
    const fighterObservables: Observable<FighterDto | undefined>[] = [];

    for (let i = 1; i <= 15; i++) {
      const fighterId = this.positions.find((p) => p.key === i)?.value;
      fighterObservables[i] = fighterId
        ? this._fighterService
            .getById(fighterId)
            .pipe(catchError(() => of(undefined)))
        : of(undefined);
    }

    forkJoin(fighterObservables.slice(1)).subscribe((fighters) => {
      for (let i = 1; i <= 15; i++) {
        this.selectedFighters[i] = fighters[i - 1];
      }
    });
  }
}
