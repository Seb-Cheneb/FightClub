import { Component, input } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_modules/material.module';

@Component({
  selector: 'app-kumite-standard',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './kumite-standard.component.html',
  styleUrls: ['./kumite-standard.component.scss'],
})
export class KumiteStandardComponent {
  fighters = input.required<FighterDto[]>();

  ngOnInit() {}

  ngOnChanges() {}
}
