import {
  Component,
  inject,
  signal,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntil, Subject, config } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuillTextEditorComponent } from '../../utilities/quill-text-editor/quill-text-editor.component';
import { OverlayContainerComponent } from '../overlay-container/overlay-container.component';
import { PatientHttpService } from '../../../services/patient-http.service';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { Note } from '../../../interfaces/INote';

@Component({
  selector: 'app-note-viewer',
  imports: [
    CommonModule,
    MatSnackBarModule,
    QuillTextEditorComponent,
    OverlayContainerComponent,
  ],
  templateUrl: './note-viewer.component.html',
  styleUrl: './note-viewer.component.scss',
})
export class NoteViewerComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pHttp: PatientHttpService,
    private tHttp: TherapistHttpService,
    protected userData: UserDataService,
    private _snackbar: MatSnackBar
  ) {}

  public user: any;
  @Input() note!: Note;

  protected tagsArray: string[] = [];

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly tags = signal<any[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  protected toggleOverlayContainer: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  // Updates the note with the given body (content, tags, title). Depending on
  // the user's role (patient or therapist), it will call the correct service
  // (PatientHttpService or TherapistHttpService) to persist the changes.
  updateNote(body: any): void {
    this.note.content = body.content;
    this.note.tags = JSON.parse(body.tags);
    this.note.title = body.title;
    sessionStorage.setItem(
      `selectedNote_${this.note.id}`,
      JSON.stringify(this.note)
    );
    if (this.user.role == 'patient') {
      this.pHttp
        .modifyNote(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            this._snackbar.open(r.message, 'Ok', { duration: 2500 });
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
      body.therapist_id = this.user.id;
      this.tHttp
        .modifyNote(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            this._snackbar.open(r.message, 'Ok', { duration: 2500 });
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

  delete(note_id: number): void {
    this.pHttp
      .deleteNote(note_id, this.user!.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          this.router.navigate(['patient/calendar']);
          this._snackbar.open('Note deleted successfully', 'Ok', {
            duration: 2500,
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
  }

  ngOnInit(): void {
    this.user = this.userData.currentUserData;
    //get note id from the route
    const urlSegments = this.route.snapshot.url;
    if (urlSegments[0].path === 'patient') return;
    const noteId = this.route.snapshot.paramMap.get('id');
    if (noteId) {
      // if exists recover data from session storage
      const storedNote = sessionStorage.getItem(`selectedNote_${noteId}`);
      if (storedNote) {
        const note = JSON.parse(storedNote);
        this.note = note;
      } else {
        //otherwise makes a request based on the user role
        const id = Number(noteId);
        if (this.user.role == 'patient') {
          this.pHttp
            .getNotes(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (r: any) => {
                this.note = r[0];
              },
              error: (e: any) => {
                console.error(e);
                this._snackbar.open(
                  e.message
                    ? e.message
                    : "Serverside error, couldn't recover note",
                  'Ok'
                );
              },
            });
        } else {
          this.tHttp
            .getNotes(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (r: any) => {
                this.note = r[0];
              },
              error: (e: any) => {
                console.error(e);
                this._snackbar.open(
                  e.message
                    ? e.message
                    : "Serverside error, couldn't recover note",
                  'Ok'
                );
              },
            });
        }
      }
    }
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem(`selectedNote_${this.note?.id}`);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
