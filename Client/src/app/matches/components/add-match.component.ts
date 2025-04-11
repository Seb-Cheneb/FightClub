import { Component, inject, input, output } from '@angular/core';
import { MaterialModule } from '../../_modules/material.module';
import { MatchDto } from '../match';
import { MatchService } from '../match.service';

@Component({
  selector: 'app-add-match',
  imports: [MaterialModule],
  templateUrl: './add-match.component.html',
  styles: ``,
})
export class AddMatchComponent {
  competitionId = input.required<string>();
  matchCreatedSignal = output<MatchDto>();

  private _matchService = inject(MatchService);

  ngOnInit() {}

  submit() {
    this._matchService.add(this.competitionId()).subscribe({
      next: (response) => {
        this.matchCreatedSignal.emit(response);
      },
      error: (e) => {
        console.error('Oops, got the following error:', e);
      },
    });
  }
}
