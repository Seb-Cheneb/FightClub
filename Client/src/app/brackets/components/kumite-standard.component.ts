import { Component, input, SimpleChanges } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';
import { MaterialModule } from '../../_modules/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kumite-standard',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './kumite-standard.component.html',
  styleUrls: ['./kumite-standard.component.scss'],
})
export class KumiteStandardComponent {
  fighters = input.required<FighterDto[]>();
  rounds: {
    pairs: [FighterDto | null, FighterDto | null][];
    roundNumber: number;
    isFinal: boolean;
  }[] = [];

  ngOnInit() {
    this.generateBracket();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fighters']) {
      this.generateBracket();
    }
  }

  private generateBracket() {
    const fighters = [...this.fighters()];
    const totalFighters = fighters.length;

    // Calculate number of rounds needed
    const numberOfRounds =
      Math.max(1, Math.ceil(Math.log2(totalFighters))) +
      (totalFighters > 2 ? 1 : 0);
    this.rounds = [];

    // First round - pair up fighters
    const firstRoundPairs: [FighterDto | null, FighterDto | null][] = [];
    for (let i = 0; i < fighters.length; i += 2) {
      firstRoundPairs.push([
        fighters[i],
        i + 1 < fighters.length ? fighters[i + 1] : null,
      ]);
    }

    this.rounds.push({
      pairs: firstRoundPairs,
      roundNumber: 1,
      isFinal: firstRoundPairs.length === 1,
    });

    // Generate subsequent rounds
    let currentPairs = firstRoundPairs.length;
    let currentRound = 2;

    while (currentPairs > 1) {
      const newPairs: [FighterDto | null, FighterDto | null][] = [];
      const pairsInThisRound = Math.ceil(currentPairs / 2);

      for (let i = 0; i < pairsInThisRound; i++) {
        newPairs.push([null, null]);
      }

      this.rounds.push({
        pairs: newPairs,
        roundNumber: currentRound,
        isFinal: pairsInThisRound === 1,
      });

      currentPairs = pairsInThisRound;
      currentRound++;
    }
  }

  trackByFn(index: number): number {
    return index;
  }
}
