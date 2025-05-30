import { Component } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-quill-text-editor',
  imports: [QuillEditorComponent, FormsModule, JsonPipe],
  templateUrl: './quill-text-editor.component.html',
  styleUrl: './quill-text-editor.component.scss',
})
export class QuillTextEditorComponent {
  jsonFormat =
    '{"ops":[{"insert":"hello"},{"attributes":{"list":"ordered"},"insert":"\\n"},{"insert":"world"},{"attributes":{"list":"ordered"},"insert":"\\n"}]}';
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, 4, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ align: [] }],
    ],
  };
}
