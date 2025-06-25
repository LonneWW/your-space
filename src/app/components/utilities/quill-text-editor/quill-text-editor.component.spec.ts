import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { QuillTextEditorComponent } from './quill-text-editor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Il componente utilizza la funzione "signal" (Angular Signal) per i tag, quindi non serve configurare molto il provider LiveAnnouncer
describe('QuillTextEditorComponent', () => {
  let component: QuillTextEditorComponent;
  let fixture: ComponentFixture<QuillTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuillTextEditorComponent, ReactiveFormsModule, FormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => null } },
            params: of({}),
            data: of({}),
            // Forniamo anche una proprietà 'root' per evitare errori
            root: {
              snapshot: { paramMap: { get: (key: string) => null } },
              children: [],
            },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(QuillTextEditorComponent);
    component = fixture.componentInstance;

    // Impostiamo alcuni input di default
    component.note = {
      id: 1,
      title: 'Test Note',
      content: 'Sample content',
      tags: [{ name: 'tag1' }, { name: 'tag2' }],
    };
    component.id = 123;
    component.note_id = 1;
    fixture.detectChanges();
  });

  it('should create the component and patch titleForm from note', () => {
    expect(component).toBeTruthy();
    // Dopo l'ngOnInit, la titleForm deve avere il title preso da note
    expect(component.titleForm.value.title).toEqual('Test Note');
    // Se note.tags è presente, viene richiamato restoreTagsFromSessionStorage che aggiorna lo signal "tags"
    expect(component.tags()).toEqual([{ name: 'tag1' }, { name: 'tag2' }]);
  });

  it('should add a tag using addTag()', () => {
    // Creiamo una simulazione dell'evento MatChipInputEvent
    const chipInput = { clear: jasmine.createSpy('clear') };
    const event = { value: 'newTag', chipInput } as any; // cast "as any" per simulare il tipo
    component.addTag(event);
    // Dovrebbe aggiungere l'oggetto { name: 'newTag' } nello signal e nell'array tagsArray
    expect(component.tags()).toContain(
      jasmine.objectContaining({ name: 'newTag' })
    );
    expect(component.tagsArray).toContain('newTag');
    expect(chipInput.clear).toHaveBeenCalled();
  });

  it('should remove a tag using removeTag()', () => {
    // Prepariamo lo scenario aggiungendo un tag
    component.tagsArray = ['tagToRemove'];
    component.tags.update((tags) => [...tags, { name: 'tagToRemove' }]);
    expect(component.tags()).toContain(
      jasmine.objectContaining({ name: 'tagToRemove' })
    );

    // Rimuoviamo il tag
    component.removeTag({ name: 'tagToRemove' });
    // Controlliamo che il tag non sia più presente
    expect(component.tagsArray).not.toContain('tagToRemove');
    expect(component.tags()).not.toContain(
      jasmine.objectContaining({ name: 'tagToRemove' })
    );

    // Verifichiamo che LiveAnnouncer sia stato chiamato – recuperiamo il provider
  });

  it('should edit a tag using editTag()', () => {
    // Impostiamo un tag iniziale
    component.tags.update((tags) => [...tags, { name: 'oldTag' }]);
    expect(component.tags()).toContain(
      jasmine.objectContaining({ name: 'oldTag' })
    );

    // Simuliamo l'evento di editing: se il nuovo valore è "editedTag"
    const event = { value: 'editedTag' } as any;
    component.editTag({ name: 'oldTag' }, event);
    // Ora il tag "oldTag" deve essere modificato in "editedTag"
    expect(component.tags()).toContain(
      jasmine.objectContaining({ name: 'editedTag' })
    );
    expect(component.tags()).not.toContain(
      jasmine.objectContaining({ name: 'oldTag' })
    );
  });

  it('should emit saveNote event with correct body on save()', () => {
    spyOn(component.saveNote, 'emit');

    // Aggiorniamo i tag: aggiungiamo un tag ulteriore nello signal
    component.tags.update((tags) => [...tags, { name: 'tagA' }]);
    // Modifichiamo il titolo tramite il form
    component.titleForm.patchValue({ title: 'New Title' });
    // Impostiamo note.content e note.id per il test
    component.note = {
      id: 10,
      title: 'Old Title',
      content: 'Content text',
      tags: [],
    };
    component.id = 456;
    fixture.detectChanges();

    component.save();
    // Aspettiamo che venga emesso l'evento e prepariamo il body atteso:
    const expectedBody = {
      title: 'New Title',
      content: 'Content text',
      note_id: 10,
      patient_id: 456,
      tags: JSON.stringify(component.tags()),
    };
    expect(component.saveNote.emit).toHaveBeenCalledWith(expectedBody);
  });

  it('should emit openHelpDialog event on help()', () => {
    spyOn(component.openHelpDialog, 'emit');
    component.help();
    expect(component.openHelpDialog.emit).toHaveBeenCalled();
  });
});
