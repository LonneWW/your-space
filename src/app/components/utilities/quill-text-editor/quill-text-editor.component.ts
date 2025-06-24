import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-quill-text-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    QuillEditorComponent,
    FormsModule,
  ],
  templateUrl: './quill-text-editor.component.html',
  styleUrl: './quill-text-editor.component.scss',
})
export class QuillTextEditorComponent implements OnInit {
  @Input() note!: any;
  @Input() sharable: boolean = false;
  @Input() role: 'patient' | 'therapist' = 'patient';
  //user o user.id

  @Input() id!: number;
  @Input() note_id!: number;
  @Input() noteContentJSON: string = '';

  @Output() saveNote = new EventEmitter();
  @Output() changeNoteVisibility = new EventEmitter();
  @Output() deleteNote = new EventEmitter();
  @Output() openHelpDialog = new EventEmitter();

  constructor(private route: ActivatedRoute) {}

  protected tagsArray: string[] = [];

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly tags = signal<any[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  public titleForm: FormGroup = new FormGroup({
    title: new FormControl<string>('New Note', [Validators.maxLength(50)]),
  });

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

  save() {
    let title = this.titleForm.value.title
      ? this.titleForm.value.title
      : 'New note';
    let tags = JSON.stringify(this.tags());
    const body = {
      title: title,
      content: this.note.content,
      note_id: this.note.id,
      patient_id: Number(this.id),
      tags: tags,
    };
    this.saveNote.emit(body);
  }

  help() {
    this.openHelpDialog.emit();
  }

  restoreTagsFromSessionStorage(array: any[]) {
    for (let i = 0; array.length > i; i++) {
      const tag = array[i];
      this.tags.update((tags) => [...tags, tag]);
    }
  }

  ngOnInit(): void {
    console.log(this.note);
    if (this.note.tags) {
      this.restoreTagsFromSessionStorage(this.note.tags);
    }
    this.titleForm.patchValue({ title: this.note.title });
  }
}
