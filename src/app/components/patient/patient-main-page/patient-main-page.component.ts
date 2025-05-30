import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { OverlayContainerComponent } from '../../utilities/overlay-container/overlay-container.component'; //DA ELIMINARE!

@Component({
  selector: 'app-patient-main-page',
  imports: [RouterOutlet, OverlayContainerComponent],
  templateUrl: './patient-main-page.component.html',
  styleUrl: './patient-main-page.component.scss',
})
export class PatientMainPageComponent {}
