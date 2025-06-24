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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatProgressSpinnerModule,
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

  protected user: any;
  @Input() note!: Note;
  protected saving: boolean = false;

  protected tagsArray: string[] = [];

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly tags = signal<any[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  protected toggleOverlayContainer: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  updateNote(body: any) {
    this.saving = true;
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
            console.log(r);
            setTimeout(() => {
              this.saving = false;
            }, 1000);
            this._snackbar.open(r.message, 'Ok', { duration: 2500 });
          },
          error: (e: any) => {
            console.log(e);
            this.saving = false;
            this._snackbar.open(e.message, 'Ok');
          },
        });
    } else {
      body.therapist_id = this.user.id;
      this.tHttp
        .modifyNote(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            console.log(r);
            setTimeout(() => {
              this.saving = false;
            }, 1000);
            this._snackbar.open(r.message, 'Ok', { duration: 2500 });
          },
          error: (e: any) => {
            console.log(e);
            this.saving = false;
            this._snackbar.open(e.message, 'Ok');
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
          console.log(r);
          this.router.navigate(['patient/calendar']);
          alert('Note deleted successfully');
        },
      });
  }

  clack() {
    console.log(this.note);
  }

  ngOnInit(): void {
    this.user = this.userData.currentUserData;
    console.log(this.user);
    // Legge l'id dalla rotta
    const noteId = this.route.snapshot.paramMap.get('id');
    if (noteId) {
      // Recupera la nota usando la chiave univoca
      const storedNote = sessionStorage.getItem(`selectedNote_${noteId}`);
      if (storedNote) {
        console.log(storedNote);
        const note = JSON.parse(storedNote);
        this.note = note;
        console.log(note);
      } else {
        // In alternativa, effettua una chiamata al backend per recuperarla
      }
    }
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem(`selectedNote_${this.note.id}`);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
