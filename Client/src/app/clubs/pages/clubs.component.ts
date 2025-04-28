import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { ClubService } from '../club.service';
import { ClubDto } from '../club';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clubs',
  imports: [],
  templateUrl: './clubs.component.html',
  styles: ``,
})
export class ClubsComponent {
  userId: string = '';
  userClub!: ClubDto;

  private _snackBar = inject(MatSnackBar);
  private _authService = inject(AuthenticationService);
  private _clubService = inject(ClubService);

  ngOnInit() {
    this.userId = this._authService.userId;
    this._clubService.getByUserId(this.userId).subscribe({
      next: (r) => (this.userClub = r),
      error: (e) => this._snackBar.open(e, 'close'),
    });
  }
}
