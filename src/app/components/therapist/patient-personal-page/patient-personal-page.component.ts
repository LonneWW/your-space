import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { OverlayContainerComponent } from '../../utilities/overlay-container/overlay-container.component';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { NoteViewerComponent } from '../../utilities/note-viewer/note-viewer.component';
import { Note } from '../../../interfaces/INote';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-patient-personal-page',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule,
    OverlayContainerComponent,
    NoteViewerComponent,
  ],
  templateUrl: './patient-personal-page.component.html',
  styleUrl: './patient-personal-page.component.scss',
})
export class PatientPersonalPageComponent implements OnInit, OnDestroy {
  displayedColumns: any[] = ['title', 'tags', 'date', 'view'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private tHttp: TherapistHttpService,
    private userData: UserDataService,
    private router: Router,
    private _snackbar: MatSnackBar,
    private titleService: Title
  ) {}

  protected user: any;
  protected patient: any = {};

  protected note: any = {
    content: '{"ops":[{"insert":"New note"}]}',
    tags: null,
    title: 'Patient note',
  };

  protected patientNotes: any = new MatTableDataSource([]);

  public toggleOverlayContainer: boolean = false;
  protected noteContent: string = '';
  protected destroy$: Subject<void> = new Subject();

  //opens a note to be viewed in an overlay container
  openNote(note: any) {
    let delta;
    try {
      delta = JSON.parse(note.content);
    } catch (error) {
      console.error('Error while parsing:', error);
      this._snackbar.open("Error while parsing, couldn't open note.", 'Ok');
      return;
    }
    if (!delta || !delta.ops) {
      this._snackbar.open(
        "Error with the note format; couldn't open note.",
        'Ok'
      );
      return;
    }
    const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
    this.noteContent = converter.convert();
    this.toggleOverlayContainer = true;
  }
  //discharge patient
  dischargePatient() {
    //ask permission to discharge the patienteì
    const pass = confirm('Do you wish to discharge this patient?');
    //if given
    if (!pass) return;
    //prepares the body of the request
    const body = {
      patient_id: this.patient.id,
      therapist_id: this.user.id,
    };
    //makes the request
    this.tHttp
      .dischargePatient(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          //if successfull notifies the user and goes to the main page
          this._snackbar.open(
            r.message ? r.message : 'Patient discharged successfully',
            'Ok',
            { duration: 2500 }
          );
          this.router.navigate(['/']);
        },
        error: (e: any) => {
          //otherwise it shows the error and notifies the user
          console.log(e);
          this._snackbar.open(e.message, 'Ok');
        },
      });
  }

  //on init
  ngOnInit(): void {
    //save the data taken from the list-of-patients' navigateToUserPage
    this.patient = history.state?.data;
    let title;
    if (this.patient && this.patient.name && this.patient.surname) {
      title = `${this.patient.name} ${this.patient.surname}`;
    } else {
      title = 'Patient';
    }
    this.titleService.setTitle('Your Space - ' + title + ' Page');
    //save user data locally
    this.user = this.userData.currentUserData;
    //request all the notes shared by the patient
    this.tHttp
      .getPatientNotes(this.user?.id, this.patient?.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          this.patientNotes = new MatTableDataSource(r);
          this.patientNotes.sort = this.sort;
        },
        error: (e: any) => {
          console.log(e);
          this._snackbar.open('The patient has no notes to share', 'Ok');
        },
      });
    //request all the notes about the patient
    this.tHttp.getNotesAboutPatient(this.patient?.id, this.user?.id).subscribe({
      next: (r: any) => {
        this.note = r[0];
      },
      error: (e: any) => {
        console.log(e);
        this._snackbar.open("Couldn't get note about the patient", 'Ok');
        // this.router.navigate(['/therapist/patients-list']);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
