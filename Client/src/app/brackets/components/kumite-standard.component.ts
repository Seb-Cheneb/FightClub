import { Component, input } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';

@Component({
  selector: 'app-kumite-standard',
  imports: [],
  templateUrl: './kumite-standard.component.html',
  styleUrl: './kumite-standard.component.scss'
})
export class KumiteStandardComponent {
  fighters = input.required<FighterDto[]>();

}
