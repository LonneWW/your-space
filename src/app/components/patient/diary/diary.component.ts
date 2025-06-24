import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntil, Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserDataService } from '../../../services/user-data.service';
import { UserData } from '../../../interfaces/IUserData';
import { PatientHttpService } from '../../../services/patient-http.service';
import { NoteViewerComponent } from '../../utilities/note-viewer/note-viewer.component';
import { Note } from '../../../interfaces/INote';
import { TherapistHttpService } from '../../../services/therapist-http.service';

@Component({
  selector: 'app-diary',
  imports: [CommonModule, MatProgressSpinnerModule, NoteViewerComponent],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
})
export class DiaryComponent implements OnInit, OnDestroy {
  constructor(
    private userData: UserDataService,
    private pHttp: PatientHttpService,
    private tHttp: TherapistHttpService,
    private _snackbar: MatSnackBar
  ) {}
  protected user!: UserData | null;
  protected note!: Note;

  private destroy$: Subject<void> = new Subject<void>();

  //on init
  ngOnInit(): void {
    //save user data locally
    this.user = this.userData.currentUserData;
    //if the user data exists and its role is 'patient'
    if (this.user && this.user.role == 'patient') {
      //get the note from PatientHttpService
      this.pHttp
        .getNotes(this.user!.id, { note_id: 1 })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            this.note = r[0];
          },
          error: (e: any) => {
            console.log(e);
            this._snackbar.open('Serverside error: unable to save note.', 'Ok');
          },
        });
    } else {
      //otherwise get the note from TherapistHttpService
      this.tHttp
        .getNotes(this.user!.id, { note_id: 1 })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            this.note = r[0];
          },
          error: (e: any) => {
            console.log(e);
            this._snackbar.open('Serverside error: unable to save note.', 'Ok');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
