import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { NoteViewerComponent } from './note-viewer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientHttpService } from '../../../services/patient-http.service';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { of, throwError } from 'rxjs';
import { Note } from '../../../interfaces/INote';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NoteViewerComponent', () => {
  let component: NoteViewerComponent;
  let fixture: ComponentFixture<NoteViewerComponent>;

  // Creiamo degli spy per le dipendenze
  let activatedRouteSpy: Partial<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;
  let pHttpSpy: jasmine.SpyObj<PatientHttpService>;
  let tHttpSpy: jasmine.SpyObj<TherapistHttpService>;
  let userDataSpy: jasmine.SpyObj<UserDataService>;

  // Definiamo un esempio di nota
  const sampleNote: Note = {
    id: 1,
    patient_id: 10,
    title: 'Sample Note',
    content: 'Sample content',
    tags: JSON.stringify([{ name: 'tag1' }]),
    date: Date.now(),
    shared: 0,
    therapist_id: null,
  };

  beforeEach(async () => {
    // Simuliamo ActivatedRoute: restituisce "1" per il parametro "id"
    // activatedRouteSpy = {
    //   snapshot: { paramMap: { get: (key: string) => '1' } },
    // };

    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const patientHttpSpyObj = jasmine.createSpyObj('PatientHttpService', [
      'getNotes',
      'modifyNote',
      'deleteNote',
    ]);
    const therapistHttpSpyObj = jasmine.createSpyObj('TherapistHttpService', [
      'getNotes',
      'modifyNote',
    ]);
    // Simuliamo un utente con ruolo "patient" per default
    const userDataSpyObj = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: { id: 20, role: 'patient' },
    });

    await TestBed.configureTestingModule({
      // Il componente è standalone ed ha importato i moduli necessari
      imports: [NoteViewerComponent],
      providers: [
        // { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: PatientHttpService, useValue: patientHttpSpyObj },
        { provide: TherapistHttpService, useValue: therapistHttpSpyObj },
        { provide: UserDataService, useValue: userDataSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'note' }],
              paramMap: { get: (key: string) => null },
            },
            params: of({}),
            data: of({}),
            // Forniamo anche una proprietà 'root' per evitare errori
            root: {
              snapshot: {
                url: [{ path: 'note' }],
                paramMap: { get: (key: string) => null },
              },
              children: [],
            },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteViewerComponent);
    component = fixture.componentInstance;
    // Assegniamo direttamente alcuni valori noti
    // component.user = { id: 20, role: 'patient' };
    component.note = sampleNote;
    fixture.detectChanges();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    pHttpSpy = TestBed.inject(
      PatientHttpService
    ) as jasmine.SpyObj<PatientHttpService>;
    tHttpSpy = TestBed.inject(
      TherapistHttpService
    ) as jasmine.SpyObj<TherapistHttpService>;
    userDataSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
  });

  afterEach(() => {
    // Rimuoviamo la nota dal sessionStorage e completiamo il Subject
    sessionStorage.removeItem(`selectedNote_${sampleNote.id}`);
    component.ngOnDestroy();
  });

  describe('ngOnInit', () => {
    it('should call getNotes if no note in sessionStorage', fakeAsync(() => {
      // 1) simuliamo assenza in sessionStorage
      spyOn(sessionStorage, 'getItem').and.returnValue(null);
      // 2) forziamo il paramMap.get('id') a restituire "1"
      spyOn(
        (TestBed.inject(ActivatedRoute) as ActivatedRoute).snapshot.paramMap,
        'get'
      ).and.returnValue(sampleNote.id.toString());
      // 3) prepariamo il mock del service
      pHttpSpy.getNotes.and.returnValue(of([sampleNote]));

      // solo ora avviamo ngOnInit
      component.ngOnInit();
      tick();

      expect(pHttpSpy.getNotes).toHaveBeenCalledWith(1);
      expect(component.note).toEqual(sampleNote);
      flush();
    }));
  });

  describe('updateNote', () => {
    it('should update note using PatientHttpService when role is patient', fakeAsync(() => {
      // Prepara il body per l'update
      const body = {
        title: 'New Title',
        content: 'Updated content',
        tags: JSON.stringify([{ name: 'tagA' }]),
        note_id: sampleNote.id,
        patient_id: 20,
      };
      // Simula che patientHttp.modifyNote restituisca una risposta positiva
      pHttpSpy.modifyNote.and.returnValue(of({ message: 'Update successful' }));
      component.updateNote(body);
      tick(1000);
      expect(pHttpSpy.modifyNote).toHaveBeenCalledWith(body);
      flush();
    }));

    it('should update note using TherapistHttpService when role is therapist', fakeAsync(() => {
      // Cambia il ruolo utente in "therapist"
      component.user = { id: 30, role: 'therapist' } as any;
      const body = {
        title: 'New Title',
        content: JSON.stringify({ ops: 'Updated content' }) as unknown as JSON,
        tags: JSON.stringify({ name: 'tagB' }) as unknown as JSON,
        note_id: sampleNote.id,
        therapist_id: 20,
      };
      // Simula che tHttp.modifyNote restituisca una risposta positiva
      tHttpSpy.modifyNote.and.returnValue(
        of({ message: 'Therapist update successful' })
      );
      component.updateNote(body);
      tick(1000);
      // Il body deve essere potenziato con therapist_id uguale a component.user.id
      expect(tHttpSpy.modifyNote).toHaveBeenCalledWith(body);
      flush();
    }));

    it('should handle error in updateNote and set saving to false', fakeAsync(() => {
      const body = {
        title: 'New Title',
        content: 'Updated content',
        tags: JSON.stringify([{ name: 'tagA' }]),
        note_id: sampleNote.id,
        patient_id: 20,
      };
      // restituiamo un oggetto con error.message perché il component legge e.error.message
      pHttpSpy.modifyNote.and.returnValue(
        throwError(() => ({ error: { message: 'Update error' } }))
      );

      component.updateNote(body);
      tick(1000);
      flush();
    }));
  });

  describe('delete', () => {
    it('should delete note and navigate to patient/calendar', fakeAsync(() => {
      pHttpSpy.deleteNote.and.returnValue(of({ success: true }));
      component.delete(sampleNote.id);
      tick();
      // expect(pHttpSpy.deleteNote).toHaveBeenCalledWith(
      //   sampleNote.id,
      //   component.user.id
      // );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['patient/calendar']);
      flush();
    }));
  });
});
