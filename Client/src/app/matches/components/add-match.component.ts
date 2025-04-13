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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private _snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      competitionId: new FormControl(this.competitionId),
      category: new FormControl(''),
    });
  }

  submit() {
    if (this.form.valid) {
      const request: CreateMatchDto = {
        competitionId: this.competitionId(),
        category: this.form.value.category,
      };

      this._matchService.add(request).subscribe({
        next: (response) => this.matchCreatedSignal.emit(response),
        error: (e) => this._snackBar.open(e, 'close'),
      });
    }
  }
}
