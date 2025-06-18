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
import { QuillTextEditorComponent } from '../../utilities/quill-text-editor/quill-text-editor.component';
import { PatientHttpService } from '../../../services/patient-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { UserData } from '../../../interfaces/IUserData';
import { OverlayContainerComponent } from '../../utilities/overlay-container/overlay-container.component';

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
    QuillTextEditorComponent,
    OverlayContainerComponent,
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
  protected note: any = {};
  protected saving: boolean = false;

  protected tagsArray: string[] = [];

  protected toggleOverlayContainer: boolean = false;

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly tags = signal<any[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  private destroy$: Subject<void> = new Subject<void>();

  public noteForm: FormGroup = new FormGroup({
    title: new FormControl<string>('New Note', [Validators.maxLength(50)]),
  });

  updateNote(event: any) {
    this.saving = true;
    console.log(event);
    sessionStorage.setItem('note', event as string);
    const tagsString = JSON.stringify(this.tagsArray);
    sessionStorage.setItem('tags', tagsString);
    let title = this.noteForm.value.title;
    if (title.length < 1) {
      title = 'New note';
    }
    const tags = this.tags() as unknown as JSON;
    const body = {
      title: title,
      content: event,
      note_id: this.note.id,
      patient_id: Number(this.user!.id),
      tags: tags,
    };
    console.log(body);
    this.pHttp
      .modifyNote(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          setTimeout(() => {
            this.saving = false;
          }, 1000);
        },
        error: (e: any) => {
          console.log(e);
          this.saving = false;
        },
      });
  }

  addTag(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.update((tags) => [...tags, { name: value }]);
      this.tagsArray.push(value);
    }

    event.chipInput.clear();
  }

  removeTag(tag: any) {
    console.log(tag);
    const newArray = this.tagsArray.filter((item) => item != tag.name);
    this.tagsArray = newArray;
    this.tags.update((tags) => {
      const index = tags.indexOf(tag);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
      return [...tags];
    });
  }

  editTag(tag: any, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.removeTag(tag);
      return;
    }

    this.tags.update((tags) => {
      const index = tags.indexOf(tag);
      if (index >= 0) {
        tags[index].name = value;
        return [...tags];
      }
      return tags;
    });
  }

  delete(): void {
    this.pHttp
      .deleteNote(this.note.id, this.user!.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          this.router.navigate(['patient']);
          alert('Note deleted successfully');
        },
      });
  }

  ngOnInit(): void {
    this.user = this.userData.currentUserData;
    console.log(sessionStorage.getItem('note'));
    const tagsString = sessionStorage.getItem('tags');
    if (tagsString) {
      this.tagsArray = JSON.parse(tagsString);
    }
    this.restoreTagsFromSessionStorage(this.tagsArray);
    if (!sessionStorage.getItem('note')) {
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
            sessionStorage.setItem('note', 'note');
            this.pHttp
              .getNotes(this.user!.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (r: any) => {
                  this.note = r[r.length - 1];
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
      this.note.content = sessionStorage.getItem('note');
      this.pHttp
        .getNotes(this.user!.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r: any) => {
            this.note = r[r.length - 1];
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

  trimNoteTitle(content: string): string {
    const regex = /"insert":"(.*?)\\n/;
    const match = content.match(regex);
    let result = match && match[1] ? match[1] : '';
    if (result.length > 50) {
      result = result.substring(0, 50);
    }
    return result;
  }

  restoreTagsFromSessionStorage(array: any[]) {
    for (let i = 0; array.length > i; i++) {
      const tag = array[i];
      this.tags.update((tags) => [...tags, { name: tag }]);
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('note');
    sessionStorage.removeItem('tags');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
