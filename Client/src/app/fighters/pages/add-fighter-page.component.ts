import { Component } from '@angular/core';
import { AddFighterComponent } from '../components/add-fighter.component';
import { MaterialModule } from '../../_modules/material.module';

@Component({
  selector: 'app-add-fighter-page',
  imports: [AddFighterComponent, MaterialModule],
  templateUrl: './add-fighter-page.component.html',
})
export class AddFighterPageComponent {}
