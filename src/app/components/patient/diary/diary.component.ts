import { Component } from '@angular/core';
import { QuillTextEditorComponent } from '../../utilities/quill-text-editor/quill-text-editor.component';

@Component({
  selector: 'app-diary',
  imports: [QuillTextEditorComponent],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
})
export class DiaryComponent {}
