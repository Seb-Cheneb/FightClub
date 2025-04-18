import { Component, inject, input, OnInit } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_modules/material.module';
import { BracketDto, Position } from '../bracket';
import { BracketService } from '../bracket.service';
import { FighterService } from '../../fighters/fighter.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kumite-standard',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './kumite-standard.component.html',
  styleUrls: ['./kumite-standard.component.scss'],
})
export class KumiteStandardComponent implements OnInit {
  bracket = input.required<BracketDto>();
  fighters: FighterDto[] = [];
  positions: { [key: number]: string } = {};
  fighterMap: Map<string, FighterDto> = new Map(); // For quick fighter lookup

  private _bracketService = inject(BracketService);
  private _fighterService = inject(FighterService);

  ngOnInit() {
    this._fighterService.getAllById(this.bracket().fighterIds).subscribe({
      next: (response) => {
        this.fighters = response;
        // Create fighter map for quick lookup
        this.fighters.forEach((fighter) => {
          this.fighterMap.set(fighter.name, fighter);
        });
        this.mapPositions();
      },
    });
  }

  private mapPositions() {
    this.positions = {};
    this.bracket().positions.forEach((position) => {
      const fighter = this.fighters.find((f) => f.id === position.value);
      if (fighter) {
        this.positions[position.key] = fighter.name;
      }
    });
  }

  onSelectionChange(positionKey: number, selectedName: string) {
    const bracketId = this.bracket().id;
    let fighterId = '';

    if (selectedName) {
      const fighter = this.fighterMap.get(selectedName);
      if (fighter) {
        fighterId = fighter.id;
      }
    }

    if (fighterId) {
      // Set or update position
      this._bracketService
        .setFighterPosition(bracketId, fighterId, positionKey)
        .subscribe({
          next: (updatedBracket) => {
            // Update local positions
            this.positions[positionKey] = selectedName;
            console.log('Position updated successfully');
          },
          error: (err) => {
            console.error('Failed to update position', err);
            // Optionally revert the selection in the UI
          },
        });
    } else {
      // Remove position if empty selection
      const currentFighterName = this.positions[positionKey];
      if (currentFighterName) {
        const currentFighter = this.fighterMap.get(currentFighterName);
        if (currentFighter) {
          this._bracketService
            .removeFighterPosition(bracketId, currentFighter.id, positionKey)
            .subscribe({
              next: () => {
                delete this.positions[positionKey];
                console.log('Position removed successfully');
              },
              error: (err) => {
                console.error('Failed to remove position', err);
              },
            });
        }
      }
    }
  }

  getSelectedFighter(positionKey: number): string {
    return this.positions[positionKey] || '';
  }
}
