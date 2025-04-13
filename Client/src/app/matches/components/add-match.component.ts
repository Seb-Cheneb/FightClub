import { Component, inject, input, output } from '@angular/core';
import { MaterialModule } from '../../_modules/material.module';
import { CreateMatchDto, MatchDto } from '../match';
import { MatchService } from '../match.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-add-match',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './add-match.component.html',
  styles: ``,
})
export class AddMatchComponent {
  competitionId = input.required<string>();
  matchCreatedSignal = output<MatchDto>();
  form!: FormGroup;

  private _matchService = inject(MatchService);
  private _formBuilder = inject(FormBuilder);

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      competitionId: new FormControl(''),
      category: new FormControl(''),
    });
  }

  submit() {
    if (this.form.valid) {
      this._matchService.add(this.competitionId(), this.form.value).subscribe({
        next: (response) => {
          this.matchCreatedSignal.emit(response);
        },
        error: (e) => {
          console.error('Oops, got the following error:', e);
        },
      });
    }
  }
}
