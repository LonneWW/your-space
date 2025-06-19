import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntil, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../services/auth.service';
import { UserDataService } from '../../../services/user-data.service';
import { PatientHttpService } from '../../../services/patient-http.service';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { OverlayContainerComponent } from '../overlay-container/overlay-container.component';
@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
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
    private tHttp: TherapistHttpService
  ) {}

  protected role!: string;
  protected notifications: any[] = [];
  protected toggleOverlayContainer: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  logout() {
    const pass = confirm('Do you wish to logout?');
    if (!pass) return;
    this.auth.logout();
  }

  closeNotification(id: number) {
    this.pHttp
      .deleteNotification(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          this.notifications = this.notifications.filter(
            (item) => item.id !== id
          );
          console.log(this.notifications);
        },
        error: (e: any) => {
          console.log(e);
        },
      });
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
          console.log(r);
          this.closeNotification(notificationId);
        },
        error: (e: any) => {
          console.log(e);
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
          console.log(r);
          this.closeNotification(notificationId);
        },
        error: (e: any) => {
          console.log(e);
        },
      });
  }

  ngOnInit(): void {
    const user = this.userData.currentUserData;
    console.log(user);
    if (user) {
      this.role = user.role;
      console.log(user);
      console.log(this.role);
      if (this.role == 'patient') {
        this.pHttp
          .getNotifications(user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              console.log(r);
              this.notifications = r;
            },
            error: (e: any) => {
              console.log(e);
            },
          });
      } else if (this.role == 'therapist') {
        this.tHttp
          .getNotifications(user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              console.log(r);
              this.notifications = r;
            },
            error: (e: any) => {
              console.log(e);
            },
          });
      } else {
        console.log('role mancante');
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
