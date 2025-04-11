import { Component, inject, input, output } from '@angular/core';
import { MatchService } from '../match.service';
import { MatchDto } from '../match';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaterialModule } from '../../_modules/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FighterDto } from '../../fighters/fighter';
import { FighterService } from '../../fighters/fighter.service';
import { CompetitionService } from '../../competitions/competition.service';

@Component({
  selector: 'app-edit-match',
  imports: [MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-match.component.html',
  styles: ``,
})
export class EditMatchComponent {
  id = input.required<string>();
  output = output<void>();
  match!: MatchDto;
  matchFighters: FighterDto[] = [];
  competitionFighters: FighterDto[] = [];

  private _snackBar = inject(MatSnackBar);
  private _matchService = inject(MatchService);
  private _fighterService = inject(FighterService);
  private _competitionService = inject(CompetitionService);

  ngOnInit() {
    this.getMatch();
  }

  getMatch() {
    this._matchService.getById(this.id()).subscribe({
      next: (response) => {
        this.match = response;
        this.getMatchFighters(response.fighterIds);
        this.getCompetitionFighters(response.competitionId);
      },
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  getMatchFighters(ids: string[]) {
    this._fighterService.getAllById(ids).subscribe({
      next: (response) => (this.matchFighters = response),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  getCompetitionFighters(id: string) {
    this._competitionService.getById(id).subscribe({
      next: (response) => {
        this._fighterService.getAllById(response.fighterIds).subscribe({
          next: (fighters) => (this.competitionFighters = fighters),
          error: (e) => this._snackBar.open(e, 'close'),
        });
      },
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  deleteMatch(id: string) {
    this._matchService.delete(id).subscribe({
      next: () => this.output.emit(),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  removeFighter(id: string) {
    this._matchService.removeFighter(this.match.id, id).subscribe({
      next: () => this.output.emit(),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }

  addFighter(id: string) {
    this._matchService.addFighter(this.match.id, id).subscribe({
      next: () => this.output.emit(),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }
  // id = input.required<string>();
  // signal = output<void>();
  // match!: MatchDto;
  // form!: FormGroup;
  // selectedFighter: string = '';
  // private _snackBar = inject(MatSnackBar);
  // private _formBuilder = inject(FormBuilder);
  // private _matchService = inject(MatchService);
  // ngOnInit() {
  //   this.initializeForm();
  //   this.getMatch();
  // }
  // getMatch() {
  //   this._matchService.getById(this.id()).subscribe({
  //     next: (response) => {
  //       this.match = response;
  //       this.updateForm(response);
  //     },
  //     error: (e) => this._snackBar.open(e, 'close'),
  //   });
  // }
  // initializeForm() {
  //   this.form = this._formBuilder.group({
  //     id: new FormControl(''),
  //     competitionId: new FormControl(''),
  //     winner: new FormControl(''),
  //     fighterIds: new FormControl([]),
  //   });
  // }
  // updateForm(data: MatchDto) {
  //   this.form.patchValue({
  //     id: data.id,
  //     competitionId: data.competitionId,
  //     winner: data.winner,
  //     fighterIds: data.fighterIds,
  //   });
  // }
  // submit() {
  //   if (this.form.valid) {
  //     this._matchService.update(this.form.value).subscribe({
  //       next: () => this.signal.emit(),
  //       error: (e) => this._snackBar.open(e, 'close'),
  //     });
  //   }
  // }
  // delete(id: string) {
  //   this._matchService.delete(id).subscribe({
  //     next: () => this.signal.emit(),
  //     error: (e) => this._snackBar.open(e, 'close'),
  //   });
  // }
  // removeFighter(id: string) {
  //   this._matchService.removeFighter(this.match.id, id).subscribe({
  //     next: () => this.signal.emit(),
  //     error: (e) => this._snackBar.open(e, 'close'),
  //   });
  // }
}
