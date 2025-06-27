import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { takeUntil, Subject } from 'rxjs';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientHttpService } from '../../../services/patient-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { UserData } from '../../../interfaces/IUserData';
import { NoteViewerComponent } from '../../utilities/note-viewer/note-viewer.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-daily-note',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NoteViewerComponent,
  ],
  templateUrl: './daily-note.component.html',
  styleUrl: './daily-note.component.scss',
})
export class DailyNoteComponent implements OnInit, OnDestroy {
  constructor(
    private userData: UserDataService,
    private pHttp: PatientHttpService,
    private router: Router,
    private _snackbar: MatSnackBar,
    private titleService: Title
  ) {
    this.titleService.setTitle('Your Space - Daily Note');
  }

  public user!: UserData | null;
  public note!: any;
  protected saving: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  //on init
  ngOnInit(): void {
    //save the user data locally
    this.user = this.userData.currentUserData;
    //check if the note is saved in the session storage
    const noteId = sessionStorage.getItem('note_id');
    //If there isnt
    if (!noteId) {
      //create a new note in the database
      const body = {
        title: 'New Note',
        content: '{"ops":[{"insert":"New note\\n"}]}' as unknown as JSON,
        tags: null,
        patient_id: this.user!.id,
      };
      this.pHttp
        .postNote(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            //once posted, request its data
            this.pHttp
              .getNotes(this.user!.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (r: any) => {
                  this.note = r[r.length - 1];
                  sessionStorage.setItem('note_id', this.note.id.toString());
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
      const note = sessionStorage.getItem(`selectedNote_${noteId}`);
      //if a note is saved in the session storage
      if (note) {
        //recover note data and save them locally
        this.note = JSON.parse(note);
      } else {
        //otherwise request note data remotely
        this.pHttp
          .getNotes(this.user!.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              this.note = r[r.length - 1];
              sessionStorage.setItem('note_id', this.note.id.toString());
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
    sessionStorage.removeItem(`selectedNote_${this.note?.id}`);
    sessionStorage.removeItem('note_id');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
