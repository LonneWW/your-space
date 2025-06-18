import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TherapistCardComponent } from '../therapist-card/therapist-card.component';
@Component({
  selector: 'app-list-of-features',
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    TherapistCardComponent,
  ],
  templateUrl: './list-of-features.component.html',
  styleUrl: './list-of-features.component.scss',
})
export class ListOfFeaturesComponent {
  constructor(private router: Router) {}

  dailyNoteConfirm() {
    const pass = confirm(
      'By entering the "Daily Note" section a new note will be created. \nDo you wish to continue?'
    );
    if (pass) {
      this.router.navigate(['patient/daily-note']);
    }
  }
}
