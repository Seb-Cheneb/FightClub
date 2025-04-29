import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { ClubService } from '../club.service';
import { ClubDto } from '../club';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../_modules/material.module';
import { Router } from '@angular/router';
import { Client } from '../../_environments/client';

@Component({
  selector: 'app-clubs',
  imports: [MaterialModule],
  templateUrl: './clubs.component.html',
  styles: ``,
})
export class ClubsComponent {
  userId: string = '';
  userHasClub: boolean = false;
  userClub!: ClubDto;

  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  private _authService = inject(AuthenticationService);
  private _clubService = inject(ClubService);

  ngOnInit() {
    this.userId = this._authService.userId;
    this._clubService.getByUserId(this.userId).subscribe({
      next: (r) => {
        this.userHasClub = !this.userHasClub;
        this.userClub = r;
      },
      error: (e) => {
        this.userHasClub = false;
        this._snackBar.open(e, 'close');
      },
    });
  }

  addClub() {
    this._router.navigateByUrl(Client.addClub(this.userId));
  }

  editClub() {
    this._router.navigateByUrl(Client.editClub(this.userClub.id));
  }
}
