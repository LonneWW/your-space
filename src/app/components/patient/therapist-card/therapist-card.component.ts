import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpService } from '../../../services/http.service';
import { takeUntil, Subject } from 'rxjs';
import { OverlayContainerComponent } from '../../utilities/overlay-container/overlay-container.component';
import { ListOfAllTherapistsComponent } from '../list-of-all-therapists/list-of-all-therapists.component';

@Component({
  selector: 'app-therapist-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    OverlayContainerComponent,
    ListOfAllTherapistsComponent,
  ],
  templateUrl: './therapist-card.component.html',
  styleUrl: './therapist-card.component.scss',
})
export class TherapistCardComponent implements OnInit, OnDestroy {
  constructor(private httpService: HttpService) {}
  protected therapist:
    | { id: number; name: string; surname: string }
    | undefined
    | null = null;
  protected toggleOverlayContainer: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    let therapist_id = sessionStorage.getItem('therapist_id');
    console.log(therapist_id);
    if (therapist_id !== 'null') {
      const id = Number(therapist_id);
      this.httpService
        .getTherapist(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            console.log(r);
            this.therapist = r[0];
          },
          error: () => {
            this.therapist = undefined;
          },
        });
    }
  }

  openTherapistsList() {
    this.toggleOverlayContainer = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
