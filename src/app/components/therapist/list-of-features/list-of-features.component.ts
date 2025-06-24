import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-list-of-features',
  imports: [RouterModule, MatIconModule, MatCardModule],
  templateUrl: './list-of-features.component.html',
  styleUrl: './list-of-features.component.scss',
})
export class ListOfTherapistFeaturesComponent {}
