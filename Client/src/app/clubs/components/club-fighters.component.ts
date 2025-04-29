import { ClubService } from '../club.service';
import { FighterDto } from '../../fighters/fighter';
import { Component, inject, input, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../_modules/material.module';
import { FighterService } from '../../fighters/fighter.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Client } from '../../_environments/client';

@Component({
  selector: 'app-club-fighters',
  imports: [MaterialModule],
  templateUrl: './club-fighters.component.html',
  styles: ``,
})
export class ClubFightersComponent {
  clubId = input.required<string>();
  changesReceiver = input.required<number>();

  fighters: FighterDto[] = [];
  columns: string[] = [
    'name',
    'gender',
    'rank',
    'club',
    'age',
    'weight',
    'edit',
    'delete',
  ];

  private _clubService = inject(ClubService);
  private _fighterService = inject(FighterService);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);

  ngOnInit() {
    this.getFighters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['changesReceiver']) {
      this.getFighters(); // Refresh when changesReceiver changes
    }
  }

  getFighters() {
    this._clubService.getById(this.clubId()).subscribe({
      next: (r) => (this.fighters = r.fighters),
    });
  }

  delete(id: string) {
    this._fighterService.delete(id).subscribe({
      next: () => this.getFighters(),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  edit(id: string) {
    this._router.navigateByUrl(Client.editFighter(id));
  }

  calculateAge(birthdate: string): number {
    if (!birthdate) {
      return NaN;
    }

    const birthDateObj = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    const dayDifference = today.getDate() - birthDateObj.getDate();

    // Adjust if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }
}
