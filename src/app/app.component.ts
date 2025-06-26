import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { LoaderService } from './services/loader.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressBar, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(protected loader: LoaderService) {
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
      sanitizer.bypassSecurityTrustResourceUrl('/assets/person_cancel-icon.svg')
    );

    iconRegistry.addSvgIcon(
      'account-circle',
      sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/account-circle-icon.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'group',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/group-icon.svg')
    );

    iconRegistry.addSvgIcon(
      'person-off',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/person-off-icon.svg')
    );

    iconRegistry.addSvgIcon(
      'face',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/face-icon.svg')
    );

    iconRegistry.addSvgIcon(
      'person-search',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/person-search-icon.svg')
    );

    iconRegistry.addSvgIcon(
      'person-remove',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/person-remove-icon.svg')
    );
  }
  title = 'your-space';
}
