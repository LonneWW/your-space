import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntil, Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpService } from '../../../services/http.service';
import { UserDataService } from '../../../services/user-data.service';
import { UserData } from '../../../interfaces/IUserData';
import { PatientHttpService } from '../../../services/patient-http.service';
@Component({
  selector: 'app-list-of-all-therapists',
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './list-of-all-therapists.component.html',
  styleUrl: './list-of-all-therapists.component.scss',
})
export class ListOfAllTherapistsComponent implements OnInit {
  constructor(
    private http: HttpService,
    private pHttp: PatientHttpService,
    private snackbar: MatSnackBar,
    private userDataService: UserDataService
  ) {}

  protected therapistsList: { id: number; name: string; surname: string }[] =
    [];
  private destroy$: Subject<void> = new Subject<void>();

  //on init
  ngOnInit(): void {
    //get the list of all therapists
    let user = this.userDataService.currentUserData;
    if (!user) {
      user = this.userDataService.sessionStorageUser;
    }
    this.http
      .getAllTherapists(user!.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          this.therapistsList = r;
        },
        error: (e: any) => {
          console.error(e);
          this.snackbar.open(
            e.error.message
              ? e.error.message
              : 'Serverside error: something went wrong with your request.',
            'Ok'
          );
        },
      });
  }

  //select therapist function
  selectTherapist(therapist_id: number) {
    //if the user confirms
    const allow = confirm('Do you wish to select this therapist?');
    if (!allow) return;
    //get the user id
    const patient_id_string = sessionStorage.getItem('id');
    const patient_id = Number(patient_id_string);
    //prepare the body for the request
    const body = { patient_id: patient_id, therapist_id: therapist_id };
    //make the request
    this.pHttp
      .selectTherapist(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          //if the request is successfull, update the local data
          sessionStorage.setItem('therapist_id', '0');
          const data = this.userDataService.currentUserData;
          data!.therapist_id = 0;
          this.userDataService.updateUserData(data as UserData);
          this.snackbar.open(r.message, 'Ok');
        },
        error: (e: any) => {
          console.error(e);
          this.snackbar.open(
            e.error.message
              ? e.error.message
              : 'Serverside error: something went wrong with your request.',
            'Ok'
          );
        },
      });
  }
}
