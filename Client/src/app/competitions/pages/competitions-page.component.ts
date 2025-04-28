import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../_modules/material.module';
import { Client } from '../../_environments/client';
import { CompetitionService } from '../competition.service';

@Component({
  selector: 'app-competitions-page',
  imports: [MaterialModule],
  templateUrl: './competitions-page.component.html',
  styles: ``,
})
export class CompetitionsPageComponent {
  data: any;

  private _service = inject(CompetitionService);
  private _router = inject(Router);

  ngOnInit() {
    this.getData();
  }

  getData() {
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

  getCompetitionPage(id: string) {
    this._router.navigateByUrl(Client.editCompetition(id));
  }
}
