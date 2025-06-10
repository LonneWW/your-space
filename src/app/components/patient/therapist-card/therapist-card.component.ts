import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { HttpService } from '../../../services/http.service';
import { takeUntil, Subject } from 'rxjs';
import { OverlayContainerComponent } from '../../utilities/overlay-container/overlay-container.component';
import { ListOfAllTherapistsComponent } from '../list-of-all-therapists/list-of-all-therapists.component';
import { UserDataService } from '../../../services/user-data.service';
import { UserData } from '../../../interfaces/IUserData';

@Component({
  selector: 'app-therapist-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    OverlayContainerComponent,
    ListOfAllTherapistsComponent,
  ],
  templateUrl: './therapist-card.component.html',
  styleUrl: './therapist-card.component.scss',
})
export class TherapistCardComponent implements OnInit, OnDestroy {
  constructor(
    private httpService: HttpService,
    private userDataService: UserDataService
  ) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIcon(
      'face',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/face-icon.svg')
    );
  }

  protected therapist:
    | { id: number; name: string; surname: string }
    | undefined
    | null = null;
  protected therapistId: number | undefined | null = null;

  protected toggleOverlayContainer: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    let therapistIdString = sessionStorage.getItem('therapist_id');
    switch (therapistIdString) {
      case 'null':
        this.therapistId = null;
        return;
      case 'undefined':
        this.therapistId = undefined;
        return;
      default:
        this.therapistId = Number(therapistIdString);
    }
    this.httpService
      .getTherapist(this.therapistId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          this.therapist = r[0];
        },
        error: () => {
          this.therapistId = undefined;
          this.therapist = undefined;
          console.log('bibi');
          // DA COMPLETARE
        },
      });
    this.userDataService.userData$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (r: any) => {
        console.log('AAAAAAH');
        const data = r as UserData;
        console.log(data);
        console.log(this.therapistId);
        if (data.therapist_id != this.therapistId)
          this.therapistId = data.therapist_id;
        console.log(this.therapistId);
      },
    });
  }

  openTherapistsList() {
    this.toggleOverlayContainer = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
