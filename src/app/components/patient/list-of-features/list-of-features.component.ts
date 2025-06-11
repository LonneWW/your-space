import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
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
  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIcon(
      'diary',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/diary-icon.svg')
    );

    iconRegistry.addSvgIcon(
      'calendar',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/calendar-icon.svg')
    );

    iconRegistry.addSvgIcon(
      'calendar-daily',
      sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/calendar-today-icon.svg'
      )
    );
  }
}
