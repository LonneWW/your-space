import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
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

    iconRegistry.addSvgIcon(
      'person_cancel',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/person_cancel.svg')
    );

    iconRegistry.addSvgIcon(
      'account-circle',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/account-circle.svg')
    );
  }
  title = 'your-space';
}
