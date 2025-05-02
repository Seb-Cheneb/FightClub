import { Component, input } from '@angular/core';
import { FighterDto } from '../fighter';
import { MaterialModule } from '../../_modules/material.module';

@Component({
  selector: 'app-fighter-list',
  imports: [MaterialModule],
  templateUrl: './fighter-list.component.html',
  styles: ``,
})
export class FighterListComponent {
  fighters = input.required<FighterDto[]>();
  tableColumns: string[] = ['name', 'rank', 'weight', 'club'];
}
