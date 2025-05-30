import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TherapistCardComponent } from '../therapist-card/therapist-card.component';
@Component({
  selector: 'app-list-of-features',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    TherapistCardComponent,
  ],
  templateUrl: './list-of-features.component.html',
  styleUrl: './list-of-features.component.scss',
})
export class ListOfFeaturesComponent {}
