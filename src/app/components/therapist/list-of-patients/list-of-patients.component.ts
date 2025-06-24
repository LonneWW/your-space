import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntil, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserDataService } from '../../../services/user-data.service';
import { TherapistHttpService } from '../../../services/therapist-http.service';
@Component({
  selector: 'app-list-of-patients',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './list-of-patients.component.html',
  styleUrl: './list-of-patients.component.scss',
})
export class ListOfPatientsComponent implements OnInit, OnDestroy {
  constructor(
    private userData: UserDataService,
    private tHttp: TherapistHttpService,
    private router: Router
  ) {}
  protected user!: any;
  protected patientsList: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  navigateToUserPage(patient: any) {
    this.router.navigate([`therapist/patient/${patient.id}`], {
      state: { data: patient },
    });
  }

  ngOnInit(): void {
    this.user = this.userData.currentUserData;
    if (this.user) {
      this.tHttp
        .getPatients(this.user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            console.log(r);
            this.patientsList = r.patients;
          },
          error: (e: any) => {
            console.log(e);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
