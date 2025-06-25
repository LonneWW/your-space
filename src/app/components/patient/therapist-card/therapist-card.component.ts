import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatSnackBarModule,
  ],
  templateUrl: './therapist-card.component.html',
  styleUrl: './therapist-card.component.scss',
})
export class TherapistCardComponent implements OnInit, OnDestroy {
  constructor(
    private httpService: HttpService,
    private userDataService: UserDataService,
    private cdr: ChangeDetectorRef,
    private _snackbar: MatSnackBar
  ) {}

  protected therapist:
    | { id: number; name: string; surname: string }
    | undefined
    | null = null;
  protected therapistId: number | undefined | null = null;

  public toggleOverlayContainer: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  //on init
  ngOnInit(): void {
    //get the therapist_id from the session storage
    let therapistIdString = sessionStorage.getItem('therapist_id');
    //change the type of the value from string to null/number
    if (therapistIdString === 'null') {
      this.therapistId = null;
    } else {
      this.therapistId = Number(therapistIdString);
    }
    //if value is a number and not 0 (representing a pending state of the request to a therapist)
    if (this.therapistId && this.therapistId > 0) {
      //get the therapist data
      this.httpService
        .getTherapist(this.therapistId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            this.therapist = r[0];
          },
          error: (e: any) => {
            console.log(e);
            this.therapistId = undefined;
            this.therapist = undefined;
            this._snackbar.open(
              "Serverside error: couldn't get therapist details",
              'Ok'
            );
          },
        });
    }
    //since therapist_id could be changed from outer sources, subscribe to the stream userData to keep the data and view updated
    this.userDataService.userData$.subscribe({
      next: (r: any) => {
        const data = r as UserData;
        const tp_id = data.therapist_id;
        if (tp_id === 'null' || tp_id === null) {
          this.therapistId = null;
        } else {
          this.therapistId = Number(tp_id);
        }
        this.toggleOverlayContainer = false;
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
