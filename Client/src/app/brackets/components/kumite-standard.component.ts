import { Component, input } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kumite-standard',
  standalone: true,
  imports: [CommonModule],
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

  ngOnChanges() {
    this.generateBracket();
  }

  private generateBracket() {
    const fighters = [...this.fighters()];
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

  trackByRound(index: number): number {
    return index;
  }

  trackByMatch(index: number): number {
    return index;
  }

  // Add this method to your component class
  getChampion(): string | null {
    if (this.rounds.length === 0) return null;

    const finalRound = this.rounds[this.rounds.length - 1];
    if (!finalRound.isFinal) return null;

    // In a real app, you would have logic to determine the actual winner
    // For now, we'll just return the first fighter in the final pair
    const finalPair = finalRound.pairs[0];
    return finalPair[0]?.name || finalPair[1]?.name || null;
  }
}
