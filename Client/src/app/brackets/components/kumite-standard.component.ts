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

  private _className = 'KumiteStandardComponent';
  private _logger = new Logger(this._className);
  private _bracketService = inject(BracketService);
  private _fighterService = inject(FighterService);
  private _snackBar = inject(MatSnackBar);

  ngOnInit() {
    this._bracketService.getPositions(this.bracket().id).subscribe({
      next: (response) => {
        this.positions = response;
        this.setSelectedFighters();
      },
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  setSelectedFighters() {
    for (let i = 1; i <= 15; i++) {
      const fighterId = this.positions.find((p) => p.key === i)?.value;
      if (fighterId) {
        this._fighterService.getById(fighterId).subscribe({
          next: (fighter) => {
            this.selectedFighters[i] = fighter;
          },
          error: (e) => this._snackBar.open(e, 'close'),
        });
      }
    }
  }

  onSelectionChange(position: number, fighterId: string | undefined) {
    if (!fighterId) {
      console.warn(
        `${this._className} :: onSelectionChange(position: ${position}, fighter: ${fighterId}) ---> failed to provide a valid fighterId`
      );
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
        },
        error: (error) => this._snackBar.open(error, 'close'),
      });
  }
}
