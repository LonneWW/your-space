import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntil, Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserDataService } from '../../../services/user-data.service';
import { UserData } from '../../../interfaces/IUserData';
import { PatientHttpService } from '../../../services/patient-http.service';
import { NoteViewerComponent } from '../../utilities/note-viewer/note-viewer.component';
import { Note } from '../../../interfaces/INote';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-diary',
  imports: [CommonModule, NoteViewerComponent],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
})
export class DiaryComponent implements OnInit, OnDestroy {
  constructor(
    private userData: UserDataService,
    private pHttp: PatientHttpService,
    private tHttp: TherapistHttpService,
    private _snackbar: MatSnackBar,
    private titleService: Title
  ) {
    this.titleService.setTitle('Your Space - Diary');
  }
  protected user!: UserData | null;
  public note!: Note;

  private destroy$: Subject<void> = new Subject<void>();

  //on init
  ngOnInit(): void {
    //save user data locally
    this.user = this.userData.currentUserData;
    const sessionNote = sessionStorage.getItem('selectedNote_1');
    if (sessionNote) {
      this.note = JSON.parse(sessionNote);
    } else {
      //if the user data exists and its role is 'patient'
      if (this.user && this.user.role == 'patient') {
        //get the note from PatientHttpService
        this.pHttp
          .getNotes(this.user!.id, { note_id: 1 })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              this.note = r[0];
              console.log(this.note);
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
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('selectedNote_1');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
