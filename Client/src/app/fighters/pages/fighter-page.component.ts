import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../_modules/material.module';
import { Router } from '@angular/router';
import { Client } from '../../_environments/client';
import { FighterDto } from '../fighter';
import { FighterService } from '../fighter.service';

@Component({
  selector: 'app-fighter-page',
  imports: [MaterialModule],
  templateUrl: './fighter-page.component.html',
})
export class FighterPageComponent {
  data: FighterDto[] = [];
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

  private _service = inject(FighterService);
  private _router = inject(Router);

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this._service.getAll().subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (e) => {
        console.error('Oops, got the following error:', e);
      },
      complete: () => {
        console.log('Request completed successfully');
      },
    });
  }

  delete(id: string) {
    this._service.delete(id).subscribe({
      next: () => {
        this.getAll();
      },
      error: (e) => {
        console.error('Oops, got the following error:', e);
      },
      complete: () => {
        console.log('Request completed successfully');
      },
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
