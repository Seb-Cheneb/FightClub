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
  // LOGGERs
  private className = 'KumiteStandardComponent';

  bracket = input.required<BracketDto>();
  // fighters
  selectedFighter1?: FighterDto;
  selectedFighter2?: FighterDto;
  selectedFighter3?: FighterDto;
  selectedFighter4?: FighterDto;
  selectedFighter5?: FighterDto;
  selectedFighter6?: FighterDto;
  selectedFighter7?: FighterDto;
  selectedFighter8?: FighterDto;
  selectedFighter9?: FighterDto;
  selectedFighter10?: FighterDto;
  selectedFighter11?: FighterDto;
  selectedFighter12?: FighterDto;
  selectedFighter13?: FighterDto;
  selectedFighter14?: FighterDto;
  selectedFighter15?: FighterDto;

  private _bracketService = inject(BracketService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.selectedFighter1 = this.getFighterAtPosition(1);
    this.selectedFighter2 = this.getFighterAtPosition(2);
    this.selectedFighter3 = this.getFighterAtPosition(3);
    this.selectedFighter4 = this.getFighterAtPosition(4);
    this.selectedFighter5 = this.getFighterAtPosition(5);
    this.selectedFighter6 = this.getFighterAtPosition(6);
    this.selectedFighter7 = this.getFighterAtPosition(7);
    this.selectedFighter8 = this.getFighterAtPosition(8);
    this.selectedFighter9 = this.getFighterAtPosition(9);
    this.selectedFighter10 = this.getFighterAtPosition(10);
    this.selectedFighter11 = this.getFighterAtPosition(11);
    this.selectedFighter12 = this.getFighterAtPosition(12);
    this.selectedFighter13 = this.getFighterAtPosition(13);
    this.selectedFighter14 = this.getFighterAtPosition(14);
    this.selectedFighter15 = this.getFighterAtPosition(15);
  }

  getFighterAtPosition(key: number): FighterDto | undefined {
    let fighterId = this.bracket().positions.find((i) => i.key == key)?.value;
    console.info(
      `KumiteStandardComponent :: getFighterAtPosition(key: ${key}) retrieved the fighterId: ${fighterId}`
    );
    let fighter = this.bracket().fighters.find((i) => i.id == fighterId);
    return fighter;
  }

  onSelectionChange(position: number, fighter: FighterDto) {
    this._bracketService
      .setFighterPosition(this.bracket().id, fighter.id, position)
      .subscribe({
        next: (response) => {
          console.info(
            `${this.className} :: onSelectionChange(position: ${position}, fighter: ${fighter}) set the position of the fighter and got the following response: ${response}`
          );
        },
        error: (error) => this.snackBar.open(error, 'close'),
      });
  }
}
