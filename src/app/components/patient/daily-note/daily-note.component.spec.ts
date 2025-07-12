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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  let snackbarSpy: jasmine.SpyObj<MatSnackBar>;
  let sessionGetSpy: jasmine.Spy;

  beforeEach(async () => {
    const patientHttpSpy = jasmine.createSpyObj('PatientHttpService', [
      'postNote',
      'getNotes',
    ]);
    const userDataSpyObj = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: { id: 1, role: 'patient', name: 'Test' },
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const snackbarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [DailyNoteComponent, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: PatientHttpService, useValue: patientHttpSpy },
        { provide: UserDataService, useValue: userDataSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: MatSnackBar, useValue: snackbarSpyObj },
        {
          provide: Title,
          useValue: { setTitle: jasmine.createSpy('setTitle') },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyNoteComponent);
    component = fixture.componentInstance;

    // spy once on sessionStorage.getItem and .setItem
    sessionGetSpy = spyOn(sessionStorage, 'getItem').and.returnValue(null);
    spyOn(sessionStorage, 'setItem');

    snackbarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // ensure user is set
    component.user = { id: 1, role: 'patient', name: 'John', surname: 'Doe' };

    pHttpSpy = TestBed.inject(
      PatientHttpService
    ) as jasmine.SpyObj<PatientHttpService>;
    userDataSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    sessionStorage.clear();
    component.ngOnDestroy();
  });

  describe('ngOnInit - No note_id in sessionStorage (create new note)', () => {
    it('should create a new note if no note_id is present', fakeAsync(() => {
      // by default sessionGetSpy returns null
      pHttpSpy.postNote.and.returnValue(of({}));
      pHttpSpy.getNotes.and.returnValue(of([{ id: 50 }, sampleNote]));

      component.ngOnInit();
      tick();

      expect(pHttpSpy.getNotes).toHaveBeenCalledWith(1);
      expect(component.note).toEqual(sampleNote);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'note_id',
        sampleNote.id.toString()
      );

      flush();
    }));

    it('should show snackbar error if postNote fails', fakeAsync(() => {
      sessionGetSpy.and.returnValue(null);
      pHttpSpy.postNote.and.returnValue(
        throwError(() => ({
          error: { message: 'Serverside error: unable to create note.' },
        }))
      );

      component.ngOnInit();
      tick();

      expect(snackbarSpy.open).toHaveBeenCalledWith(
        'Serverside error: unable to create note.',
        'Ok'
      );

      flush();
    }));

    it('should show snackbar error if getNotes fails after postNote', fakeAsync(() => {
      sessionGetSpy.and.returnValue(null);
      pHttpSpy.postNote.and.returnValue(of({}));
      pHttpSpy.getNotes.and.returnValue(
        throwError(() => ({ error: { message: 'Get note error' } }))
      );

      component.ngOnInit();
      tick();

      expect(snackbarSpy.open).toHaveBeenCalledWith('Get note error', 'Ok');

      flush();
    }));
  });

  describe('ngOnInit - note_id exists in sessionStorage', () => {
    it('should recover note from sessionStorage if present', () => {
      sessionGetSpy.and.callFake((key: string) => {
        if (key === 'note_id') return '123';
        if (key === 'selectedNote_123') return JSON.stringify(sampleNote);
        return null;
      });

      component.ngOnInit();

      expect(component.note).toEqual(sampleNote);
    });

    it('should request note remotely if selectedNote is not in sessionStorage', fakeAsync(() => {
      sessionGetSpy.and.callFake((key: string) => {
        if (key === 'note_id') return '123';
        return null;
      });
      pHttpSpy.getNotes.and.returnValue(of([{ id: 80 }, sampleNote]));

      component.ngOnInit();
      tick();

      expect(pHttpSpy.getNotes).toHaveBeenCalledWith(1);
      expect(component.note).toEqual(sampleNote);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'note_id',
        sampleNote.id.toString()
      );

      flush();
    }));
  });

  describe('ngOnDestroy', () => {
    it('should remove selectedNote and note_id from sessionStorage', () => {
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
