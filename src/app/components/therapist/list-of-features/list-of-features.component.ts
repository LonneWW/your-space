import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-list-of-features',
  imports: [RouterModule, MatIconModule, MatCardModule],
  templateUrl: './list-of-features.component.html',
  styleUrl: './list-of-features.component.scss',
})
export class ListOfTherapistFeaturesComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Your Space - Main Page');
  }
}
