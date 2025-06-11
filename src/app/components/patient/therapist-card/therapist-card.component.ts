import {
  Component,
  OnDestroy,
  ChangeDetectorRef,
  OnInit,
  inject,
} from '@angular/core';
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
    private userDataService: UserDataService,
    private cdr: ChangeDetectorRef
  ) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIcon(
      'face',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/face-icon.svg')
    );
    iconRegistry.addSvgIcon(
      'person-search',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/person-search-icon.svg')
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
    if (therapistIdString === 'null') {
      this.therapistId = null;
    } else {
      this.therapistId = Number(therapistIdString);
    }
    console.log(this.therapistId);
    if (this.therapistId && this.therapistId > 0) {
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
    }
    this.userDataService.userData$.subscribe({
      next: (r: any) => {
        const data = r as UserData;
        console.log(data);
        const tp_id = data.therapist_id;
        this.therapistId = tp_id === 'null' ? null : Number(tp_id);
        this.toggleOverlayContainer = false;
        console.log('cambio');
        console.log(this.therapistId);
        console.log(this.toggleOverlayContainer);
        this.cdr.detectChanges();
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
