import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntil, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserDataService } from '../../../services/user-data.service';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { Title } from '@angular/platform-browser';
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
    private router: Router,
    private _snackbar: MatSnackBar,
    private titleService: Title
  ) {
    this.titleService.setTitle('Your Space - List of Patients');
  }
  protected user!: any;
  protected patientsList: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  //navigate to user page taking the specific 'patient' data
  navigateToUserPage(patient: any) {
    this.router.navigate([`therapist/patient/${patient.id}`], {
      state: { data: patient },
    });
  }

  //on init
  ngOnInit(): void {
    //save the user data locally
    this.user = this.userData.currentUserData;
    //make the request
    if (this.user) {
      this.tHttp
        .getPatients(this.user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            this.patientsList = r.patients;
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
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
