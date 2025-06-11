import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillEditorComponent } from 'ngx-quill';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { QuillEditorBase } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import Quill from 'quill';

@Component({
  selector: 'app-quill-text-editor',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    QuillEditorComponent,
    FormsModule,
    JsonPipe,
  ],
  templateUrl: './quill-text-editor.component.html',
  styleUrl: './quill-text-editor.component.scss',
})
export class QuillTextEditorComponent {
  @Input() sharable: boolean = false;
  @Input() role: 'patient' | 'therapist' = 'patient';

  noteContentJSON = '';

  constructor() {}

  click() {
    console.log(this.noteContentJSON);
  }
}
