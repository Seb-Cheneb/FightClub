import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddFighterComponent } from '../../fighters/components/add-fighter.component';
import { ClubFightersComponent } from '../components/club-fighters.component';
import { MaterialModule } from '../../_modules/material.module';
import { ClubUpdateComponent } from '../components/club-update.component';

@Component({
  selector: 'app-club-edit',
  imports: [
    AddFighterComponent,
    ClubFightersComponent,
    MaterialModule,
    ClubUpdateComponent,
  ],
  templateUrl: './club-edit.component.html',
  styles: ``,
})
export class ClubEditComponent {
  clubId: string = '';
  refreshCounter = 0;

  private _activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.clubId = String(this._activatedRoute.snapshot.paramMap.get('id'));
  }

  changeDetected() {
    this.refreshCounter++;
  }
}
