import { Component, input, SimpleChanges } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';
import { MaterialModule } from '../../_modules/material.module';
import { Round } from '../bracket';

@Component({
  selector: 'app-kumite-standard',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './kumite-standard.component.html',
})
export class KumiteStandardComponent {
  fighters = input.required<FighterDto[]>();
  numberOfRounds: number = 0;
  rounds: Round[] = [];

  ngOnInit() {
    if (this.fighters()) {
      // First round: place fighters as is
      this.rounds.push(new Round([...this.fighters()]));

      // Next rounds: fill with empty slots
      let matches = Math.ceil(this.fighters().length / 2);
      for (let i = 1; i < this.numberOfRounds; i++) {
        const emptyRound = new Array(matches).fill(null);
        this.rounds.push(new Round(emptyRound));
        matches = Math.ceil(matches / 2);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fighters']) {
      this.getNumberOfRounds();
    }
  }

  private getNumberOfRounds() {
    console.log(this.fighters().length);
    if (this.fighters().length < 2) return;
    this.numberOfRounds = Math.ceil(Math.log2(this.fighters().length)) + 1;
    console.log(this.numberOfRounds);
  }

  // generateBracket(fighters: FighterDto[]) {
  //   this.rounds = [];
  //   this.rounds.push([...fighters]); // First round: the fighters in their original order

  //   // Generate next rounds: empty placeholders (nulls)
  //   let currentMatches = Math.ceil(fighters.length / 2);
  //   while (currentMatches >= 1) {
  //     const emptyRound = new Array(currentMatches).fill(null);
  //     this.rounds.push(emptyRound);
  //     currentMatches = Math.ceil(currentMatches / 2);
  //   }
  // }
}
