import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntil, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { UserDataService } from '../../../services/user-data.service';
import { PatientHttpService } from '../../../services/patient-http.service';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { OverlayContainerComponent } from '../overlay-container/overlay-container.component';
import { UserData } from '../../../interfaces/IUserData';
@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatSnackBarModule,
    OverlayContainerComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(
    private auth: AuthService,
    private userData: UserDataService,
    private pHttp: PatientHttpService,
    private tHttp: TherapistHttpService,
    private _snackbar: MatSnackBar
  ) {}

  protected role!: string;
  protected user!: UserData;
  public notifications: any[] = [];
  public toggleOverlayContainer: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  logout() {
    const pass = confirm('Do you wish to logout?');
    if (!pass) return;
    this.auth.logout();
  }

  //deletes the notification based on the user role
  closeNotification(id: number) {
    if (this.role == 'patient') {
      this.pHttp
        .deleteNotification(id, this.user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            this.notifications = this.notifications.filter(
              (item) => item.id !== id
            );
          },
          error: (e: any) => {
            console.log(e);
            this._snackbar.open(
              "Serverside error: couldn't delete notification.",
              'Ok'
            );
          },
        });
    } else {
      this.tHttp
        .deleteNotification(id, this.user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            this.notifications = this.notifications.filter(
              (item) => item.id !== id
            );
          },
          error: (e: any) => {
            console.log(e);
            this._snackbar.open(
              "Serverside error: couldn't delete notification.",
              'Ok'
            );
          },
        });
    }
  }

  acceptPatient(
    patientId: number,
    therapistId: number,
    notificationId: number
  ) {
    const body = { patient_id: patientId, therapist_id: therapistId };
    this.tHttp
      .acceptPatient(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          this._snackbar.open('Patient accepted successfully', 'Ok', {
            duration: 2500,
          });
          this.closeNotification(notificationId);
        },
        error: (e: any) => {
          console.log(e);
          this._snackbar.open(e.message, 'Ok');
        },
      });
  }

  rejectPatient(
    patientId: number,
    therapistId: number,
    notificationId: number
  ) {
    const body = { patient_id: patientId, therapist_id: therapistId };
    this.tHttp
      .dischargePatient(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          this._snackbar.open(r.message, 'Ok', { duration: 2500 });
          this.closeNotification(notificationId);
        },
        error: (e: any) => {
          console.log(e);
          this._snackbar.open(
            e.error.message
              ? e.error.message
              : 'Serverside error: something went wrong with your request.',
            'Ok'
          );
        },
      });
  }

  //on init
  ngOnInit(): void {
    //saves user data locally
    if (this.userData.currentUserData) {
      this.user = this.userData.currentUserData;
    } else if (this.userData.sessionStorageUser) {
      this.user = this.userData.sessionStorageUser;
    }
    if (this.user) {
      this.role = this.user.role;
      //get notifications based on role
      if (this.role == 'patient') {
        this.pHttp
          .getNotifications(this.user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              this.notifications = r;
              if (this.notifications.length > 0) {
                this._snackbar.open(
                  `You have ${this.notifications.length} new notifications.`,
                  'Ok',
                  { duration: 2500 }
                );
              }
            },
            error: (e: any) => {
              console.log(e);
              e.error.message
                ? e.error.message
                : 'Serverside error: something went wrong with your request.';
            },
          });
      } else if (this.role == 'therapist') {
        this.tHttp
          .getNotifications(this.user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              this.notifications = r;
              if (this.notifications.length > 0) {
                this._snackbar.open(
                  `You have ${this.notifications.length} new notifications.`,
                  'Ok',
                  { duration: 2500 }
                );
              }
              //truly a bad way to label the notes to change the controls
              for (let notification of this.notifications) {
                const text = notification.content as string;
                if (text.includes('interrupt')) {
                  notification.closeable = true;
                }
              }
            },
            error: (e: any) => {
              console.log(e);
              this._snackbar.open(
                e.error.message
                  ? e.error.message
                  : 'Serverside error: something went wrong with your request.',
                'Ok'
              );
            },
          });
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
