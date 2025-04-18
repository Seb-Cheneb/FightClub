import { Component, inject, input, OnInit } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_modules/material.module';
import { BracketDto, Position } from '../bracket';
import { BracketService } from '../bracket.service';
import { FighterService } from '../../fighters/fighter.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-kumite-standard',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './kumite-standard.component.html',
  styleUrls: ['./kumite-standard.component.scss'],
})
export class KumiteStandardComponent implements OnInit {
  bracket = input.required<BracketDto>();

  private _bracketService = inject(BracketService);
  private _fighterService = inject(FighterService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    // this._fighterService.getAllById(this.bracket().fighterIds).subscribe({
    //   next: (response) => {
    //     this.fighters = response;
    //     // Create fighter map for quick lookup
    //     this.fighters.forEach((fighter) => {
    //       this.fighterMap.set(fighter.name, fighter);
    //     });
    //     this.mapPositions();
    //   },
    // });
  }

  getFighterAtPosition(key: number): FighterDto | undefined {
    let fighterId = this.bracket().positions.find((i) => i.key == key)?.value;
    if (fighterId === undefined) {
      return fighterId;
    }
    let fighter = this.bracket().fighters.find((i) => i.id == fighterId);
    return fighter;
  }

  onSelectionChange(position: number, fighter: FighterDto) {
    this._bracketService
      .setFighterPosition(this.bracket().id, fighter.id, position)
      .subscribe({
        error: (error) => this.snackBar.open(error, 'close'),
      });
  }
}
