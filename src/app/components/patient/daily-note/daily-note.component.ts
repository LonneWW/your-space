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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientHttpService } from '../../../services/patient-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { UserData } from '../../../interfaces/IUserData';
import { NoteViewerComponent } from '../../utilities/note-viewer/note-viewer.component';

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
    private router: Router
  ) {}

  protected user!: UserData | null;
  protected note!: any;
  protected saving: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.user = this.userData.currentUserData;
    const noteId = sessionStorage.getItem('note_id');
    if (!noteId) {
      console.log('yoshikage');
      const body = {
        title: 'New Note',
        content: '{}' as unknown as JSON,
        tags: null,
        patient_id: this.user!.id,
      };
      this.pHttp
        .postNote(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            console.log(r);
            this.pHttp
              .getNotes(this.user!.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (r: any) => {
                  this.note = r[r.length - 1];
                  sessionStorage.setItem('note_id', this.note.id);
                  console.log(r.length);
                  console.log(r);
                  console.log(this.note);
                },
                error: (e: any) => {
                  console.log(e);
                },
              });
          },
          error: (e: any) => {
            console.log(e);
          },
        });
    } else {
      const note = sessionStorage.getItem(`selectedNote_${noteId}`);
      if (note) {
        this.note = JSON.parse(note);
      } else {
        this.pHttp
          .getNotes(this.user!.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              this.note = r[r.length - 1];
              sessionStorage.setItem('note_id', this.note.id);
              console.log(r.length);
              console.log(r);
              console.log(this.note);
            },
            error: (e: any) => {
              console.log(e);
            },
          });
      }
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(`selectedNote_${this.note.id}`);
    sessionStorage.removeItem(`note_id`);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
