import { Component } from '@angular/core';
import { MaterialModule } from '../../../_modules/material.module';

@Component({
  selector: 'app-home-page',
  imports: [MaterialModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
