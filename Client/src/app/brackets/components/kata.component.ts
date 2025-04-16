import { Component, input } from '@angular/core';
import { FighterDto } from '../../fighters/fighter';
import { MaterialModule } from '../../_modules/material.module';

@Component({
  selector: 'app-kata',
  imports: [MaterialModule],
  templateUrl: './kata.component.html',
  styleUrl: './kata.component.scss',
})
export class KataComponent {
  fighters = input.required<FighterDto[]>();
  columns: string[] = [
    'nume',
    't1n1',
    't1n2',
    't1n3',
    't1nf',
    't2n1',
    't2n2',
    't2n3',
    't2nf',
    't3n1',
    't3n2',
    't3n3',
    't3nf',
  ];

  ngOnInit() {}

  ngOnChanges() {}
}
