// import { Component, input, SimpleChanges } from '@angular/core';
// import { FighterDto } from '../../fighters/fighter';
// import { MaterialModule } from '../../_modules/material.module';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-kumite-standard',
//   standalone: true,
//   imports: [MaterialModule, CommonModule],
//   templateUrl: './kumite-standard.component.html',
//   styleUrls: ['./kumite-standard.component.scss'],
// })
// export class KumiteStandardComponent {
//   fighters = input.required<FighterDto[]>();
//   rounds: (FighterDto | null)[][] = [];
//   numberOfRounds: number = 0;

//   ngOnInit() {
//     this.generateBracket();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['fighters']) {
//       this.generateBracket();
//     }
//   }

//   private generateBracket() {
//     const fighterCount = this.fighters().length;
//     this.numberOfRounds = Math.ceil(Math.log2(fighterCount)) + 1;
//     this.rounds = [];

//     // First round with actual fighters
//     this.rounds.push([...this.fighters()]);

//     // Subsequent rounds with empty slots
//     let matchesInRound = Math.ceil(fighterCount / 2);
//     for (let i = 1; i < this.numberOfRounds; i++) {
//       this.rounds.push(new Array(matchesInRound).fill(null));
//       matchesInRound = Math.ceil(matchesInRound / 2);
//     }
//   }

//   trackByFn(index: number, item: FighterDto | null): number {
//     return index;
//   }
// }
