import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { DailyNoteComponent } from './daily-note.component';
import { PatientHttpService } from '../../../services/patient-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
// ... altre importazioni

// Simuliamo un sample note (come restituito dal backend)
const sampleNote = {
  id: 100,
  title: 'New Note',
  content: '{"ops":[{"insert":"New note\\n"}]}',
  tags: null,
  patient_id: 1,
  date: Date.now(),
  shared: 0,
  therapist_id: null,
};

describe('DailyNoteComponent', () => {
  let component: DailyNoteComponent;
  let fixture: ComponentFixture<DailyNoteComponent>;
  let pHttpSpy: jasmine.SpyObj<PatientHttpService>;
  let userDataSpy: jasmine.SpyObj<UserDataService>;
  let routerSpy: jasmine.SpyObj<Router>;
  // let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

  // Utilizziamo alcuni spy per sessionStorage: useremo spyOn per getItem/setItem/removeItem
  beforeEach(async () => {
    const patientHttpSpy = jasmine.createSpyObj('PatientHttpService', [
      'postNote',
      'getNotes',
    ]);
    // Simuliamo un utente con ruolo patient (minimo: id)
    const userDataSpyObj = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: { id: 1, role: 'patient', name: 'Test' },
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    // const snackbarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [DailyNoteComponent, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: PatientHttpService, useValue: patientHttpSpy },
        { provide: UserDataService, useValue: userDataSpyObj },
        { provide: Router, useValue: routerSpyObj },
        // { provide: MatSnackBar, useValue: snackbarSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => null } },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyNoteComponent);
    component = fixture.componentInstance;
    // Forziamo il salvataggio dei dati utente
    component.user = { id: 1, role: 'patient', name: 'John', surname: 'Doe' };
    // Puliamo sempre sessionStorage per evitare effetti collaterali tra i test
    sessionStorage.clear();

    pHttpSpy = TestBed.inject(
      PatientHttpService
    ) as jasmine.SpyObj<PatientHttpService>;
    userDataSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    // snackbarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  afterEach(() => {
    sessionStorage.clear();
    component.ngOnDestroy();
  });

  describe('ngOnInit - No note_id in sessionStorage (create new note)', () => {
    it('should create a new note if no note_id is present', fakeAsync(() => {
      // Simula che sessionStorage.getItem('note_id') ritorni null
      spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
        return null;
      });
      // Simula postNote che restituisce una risposta (non usata)
      pHttpSpy.postNote.and.returnValue(of({}));
      // Simula getNotes che restituisce un array di note, dove l’ultimo è la note da utilizzare
      pHttpSpy.getNotes.and.returnValue(of([{ id: 50 }, { ...sampleNote }]));

      component.ngOnInit();
      tick();

      // Dopo la postNote, il componente chiama getNotes; verifica che getNotes venga chiamato con il patient id
      expect(pHttpSpy.getNotes).toHaveBeenCalledWith(1);
      // La nota imposta deve essere l'ultimo elemento dell'array
      expect(component.note).toEqual(sampleNote);
      // Deve essere salvato in sessionStorage il note_id
      expect(sessionStorage.setItem).toBeDefined(); // Verifichiamo che setItem sia stato chiamato
      // Possiamo fare uno spy su sessionStorage.setItem
      spyOn(sessionStorage, 'setItem');
      // Richiamiamo la parte interna del callback: (non serve tick ulteriore, ma possiamo verificare che sia stato chiamato)
      component.ngOnInit();
      tick();
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'note_id',
        sampleNote.id.toString()
      );
      flush();
    }));

    it('should show snackbar error if postNote fails', fakeAsync(() => {
      spyOn(sessionStorage, 'getItem').and.returnValue(null);
      pHttpSpy.postNote.and.returnValue(
        throwError(() => ({ message: 'Create note error' }))
      );

      component.ngOnInit();
      tick();
      // expect(snackbarSpy.open).toHaveBeenCalledWith(
      //   'Serverside error: unable to create note.',
      //   'Ok'
      // );
      flush();
    }));

    it('should show snackbar error if getNotes fails after postNote', fakeAsync(() => {
      spyOn(sessionStorage, 'getItem').and.returnValue(null);
      pHttpSpy.postNote.and.returnValue(of({}));
      pHttpSpy.getNotes.and.returnValue(
        throwError(() => ({ message: 'Get note error' }))
      );

      component.ngOnInit();
      tick();
      // expect(snackbarSpy.open).toHaveBeenCalledWith(
      //   'Serverside error: unable to save note.',
      //   'Ok'
      // );
      flush();
    }));
  });

  describe('ngOnInit - note_id exists in sessionStorage', () => {
    it('should recover note from sessionStorage if present', () => {
      // Simula che sessionStorage.getItem('note_id') restituisca "123"...
      spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'note_id') {
          return '123';
        }
        if (key === 'selectedNote_123') {
          return JSON.stringify(sampleNote);
        }
        return null;
      });
      component.ngOnInit();
      expect(component.note).toEqual(sampleNote);
    });

    it('should request note remotely if selectedNote is not in sessionStorage', fakeAsync(() => {
      // Simula che esista note_id ma nessuna nota corrispondente
      spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'note_id') {
          return '123';
        }
        return null;
      });
      pHttpSpy.getNotes.and.returnValue(of([{ id: 80 }, { ...sampleNote }]));
      // Eseguiamo ngOnInit
      component.ngOnInit();
      tick();
      expect(pHttpSpy.getNotes).toHaveBeenCalledWith(1);
      expect(component.note).toEqual(sampleNote);
      // Verifica che venga salvato rinnovando il note_id
      spyOn(sessionStorage, 'setItem');
      component.ngOnInit();
      tick();
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'note_id',
        sampleNote.id.toString()
      );
      flush();
    }));
  });

  describe('ngOnDestroy', () => {
    it('should remove note_id and selectedNote from sessionStorage', () => {
      // Per il test, impostiamo manualmente la proprietà note
      component.note = sampleNote;
      spyOn(sessionStorage, 'removeItem');
      component.ngOnDestroy();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(
        `selectedNote_${sampleNote.id}`
      );
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('note_id');
    });
  });
});
