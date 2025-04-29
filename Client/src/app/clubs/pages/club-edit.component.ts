import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddFighterComponent } from '../../fighters/components/add-fighter.component';

@Component({
  selector: 'app-club-edit',
  imports: [AddFighterComponent],
  templateUrl: './club-edit.component.html',
  styles: ``,
})
export class ClubEditComponent {
  clubId: string = '';

  private _activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.clubId = String(this._activatedRoute.snapshot.paramMap.get('id'));
  }
}
