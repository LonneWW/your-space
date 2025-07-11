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
import { PatientHttpService } from '../../../services/patient-http.service';

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
    private pHttp: PatientHttpService,
    private userDataService: UserDataService,
    private cdr: ChangeDetectorRef,
    private _snackbar: MatSnackBar
  ) {}

  protected therapist:
    | { id: number; name: string; surname: string }
    | undefined
    | null = null;
  protected therapistId: number | undefined | null = null;
  protected user!: UserData;
  public toggleOverlayContainer: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  //on init
  ngOnInit(): void {
    //get user data
    if (this.userDataService.currentUserData) {
      this.user = this.userDataService.currentUserData;
    }
    if (this.userDataService.sessionStorageUser) {
      this.user = this.userDataService.sessionStorageUser;
    }
    //get the therapist_id from the session storage
    // let therapistIdString = this.user.therapist_id;
    const therapistIdString = this.userDataService.currentUserData?.therapist_id
      ? this.userDataService.currentUserData.therapist_id
      : this.userDataService.sessionStorageUser.therapist_id;
    console.log(therapistIdString);
    //change the type of the value from string to null/number
    if (therapistIdString === 'null') {
      this.therapistId = null;
    } else {
      this.therapistId = Number(therapistIdString);
    }
    //if value is a number and not 0 (representing a pending state of the request to a therapist)
    if (this.therapistId && this.therapistId > 0) {
      //get the therapist data
      this.pHttp
        .getTherapist(this.therapistId, this.user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            console.log(r);
            this.therapist = r[0];
          },
          error: (e: any) => {
            console.error(e);
            this.therapistId = undefined;
            this.therapist = undefined;
            this._snackbar.open(
              e.error.message
                ? e.error.message
                : 'Serverside error: something went wrong with your request.',
              'Ok'
            );
          },
        });
    }
    //since therapist_id could be changed from outer sources, subscribe to the stream userData to keep the data and view updated
    this.userDataService.userData$.subscribe({
      next: (r: any) => {
        console.log(r);
        if (r) {
          const data = r as UserData;
          const tp_id = data.therapist_id;
          console.log(tp_id);
          if (tp_id === 'null' || tp_id === null) {
            this.therapistId = null;
          } else {
            this.therapistId = Number(tp_id);
            console.log(this.therapistId);
          }
        }
        this.toggleOverlayContainer = false;
        this.cdr.detectChanges();
      },
    });
  }

  openTherapistsList() {
    this.toggleOverlayContainer = true;
  }

  unlinkTherapist() {
    const permission = confirm('Do you really wish to unlink your therapist?');
    if (!permission) return;
    if (!this.user?.id || !this.therapistId) {
      this._snackbar.open(
        'Something went wrong with your request. Please refresh the page and try again.',
        'Ok'
      );
      return;
    }
    const body = { patient_id: this.user?.id, therapist_id: this.therapistId };
    this.pHttp
      .dischargeTherapist(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          this.therapistId = null;
          this.therapist = null;
          this.user!.therapist_id = null;
          let sessionData = {
            id: JSON.stringify(this.user.id),
            name: this.user.name,
            surname: this.user.surname,
            role: this.user.role as 'patient' | 'therapist',
            therapist_id: JSON.stringify(null),
          };
          this.userDataService.saveSessionUser(sessionData);
          this.userDataService.updateUserData(this.user);
          this._snackbar.open(
            'You have successfully unlink your therapist.',
            'Ok',
            { duration: 2500 }
          );
        },
        error: (e: any) => {
          console.error(e);
          this._snackbar.open(
            e.error.message
              ? e.error.message
              : 'Serverside error: something went wrong with your request.',
            'Ok'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
