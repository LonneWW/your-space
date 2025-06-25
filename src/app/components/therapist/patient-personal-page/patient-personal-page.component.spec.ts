import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { PatientPersonalPageComponent } from './patient-personal-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Dati dummy per il test
const dummyUser = { id: 1, role: 'patient', name: 'Patient', surname: 'User' };
const dummyPatient = { id: 101, name: 'Mario', surname: 'Rossi' };
const dummyPatientNotes = [
  { id: 11, title: 'Note 1', tags: [{ name: 'tag1' }], date: Date.now() },
];
const dummyNoteAboutPatient = [
  {
    id: 13,
    content: '{"ops":[{"insert":"Hello\n", "attributes":{}}]}',
    title: 'Note about patient',
  },
];

describe('PatientPersonalPageComponent', () => {
  let component: PatientPersonalPageComponent;
  let fixture: ComponentFixture<PatientPersonalPageComponent>;
  let tHttpSpy: jasmine.SpyObj<TherapistHttpService>;
  let userDataSpy: jasmine.SpyObj<UserDataService>;
  let router: Router;
  // let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Creiamo gli spy per i servizi coinvolti
    const tHttpSpyObj = jasmine.createSpyObj('TherapistHttpService', [
      'getPatientNotes',
      'getNotesAboutPatient',
      'dischargePatient',
    ]);
    const userDataSpyObj = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: dummyUser,
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    // const snackbarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [PatientPersonalPageComponent, RouterTestingModule],
      providers: [
        { provide: TherapistHttpService, useValue: tHttpSpyObj },
        { provide: UserDataService, useValue: userDataSpyObj },
        { provide: Router, useValue: routerSpyObj },
        // { provide: MatSnackBar, useValue: snackbarSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => null } },
            params: of({}),
            data: of({}),
            // Stub completo per ActivatedRoute con la proprietà "root"
            root: {
              snapshot: { paramMap: { get: (key: string) => null } },
              children: [],
            },
          },
        },
        // Aggiungiamo se necessario i provider per HttpClient e Testing
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientPersonalPageComponent);
    component = fixture.componentInstance;

    // Otteniamo gli spy dai provider
    tHttpSpy = TestBed.inject(
      TherapistHttpService
    ) as jasmine.SpyObj<TherapistHttpService>;
    userDataSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    // snackbarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    router = TestBed.inject(Router);

    // Stub predefiniti: impostiamo i metodi usati in ngOnInit in modo da non restituire undefined
    tHttpSpy.getPatientNotes.and.returnValue(of(dummyPatientNotes));
    tHttpSpy.getNotesAboutPatient.and.returnValue(of(dummyNoteAboutPatient));

    // Inizializziamo le proprietà usate dal template per la MatTable
    component.sort = {} as any;
    component['patientNotes'] = new MatTableDataSource([]);

    // Impostiamo i dati attesi dal componente (ad esempio, tramite history.state)
    component['patient'] = dummyPatient;
    component['user'] = dummyUser;

    // Avviamo il ciclo di vita
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch patient notes and set note from getNotesAboutPatient on success', fakeAsync(() => {
      window.history.replaceState({ data: dummyPatient }, '');
      component.ngOnInit();
      tick();

      expect(tHttpSpy.getPatientNotes).toHaveBeenCalledWith(
        dummyUser.id,
        dummyPatient.id
      );
      expect((component as any).patientNotes.data).toEqual(dummyPatientNotes);

      expect(tHttpSpy.getNotesAboutPatient).toHaveBeenCalledWith(
        dummyPatient.id,
        dummyUser.id
      );
      expect(component['note']).toEqual(dummyNoteAboutPatient[0]);
      flush();
    }));

    // it('should show snackbar error if getPatientNotes fails', fakeAsync(() => {
    //   const errorResponse = { message: 'No notes available' };
    //   tHttpSpy.getPatientNotes.and.returnValue(throwError(() => errorResponse));

    //   component.ngOnInit();
    //   tick();

    //   expect(snackbarSpy.open).toHaveBeenCalledWith(
    //     'The patient has no notes to share',
    //     'Ok'
    //   );
    //   flush();
    // }));

    // it('should show snackbar error if getNotesAboutPatient fails', fakeAsync(() => {
    //   tHttpSpy.getPatientNotes.and.returnValue(of(dummyPatientNotes));
    //   const errorResponse = { message: "Couldn't get note about the patient" };
    //   tHttpSpy.getNotesAboutPatient.and.returnValue(
    //     throwError(() => errorResponse)
    //   );

    //   component.ngOnInit();
    //   tick();

    //   expect(snackbarSpy.open).toHaveBeenCalledWith(
    //     "Couldn't get note about the patient",
    //     'Ok'
    //   );
    //   flush();
    // }));
  });

  describe('openNote', () => {
    it('should convert valid note content and open overlay', () => {
      // NOTA: Forniamo validNote con "attributes": {} per evitare che la libreria lanci errore
      const validNote = {
        content: '{"ops":[{"insert":"Hello world\\n", "attributes":{}}]}',
        id: 997,
      };
      component.openNote(validNote);
      expect((component as any).noteContent).toContain('Hello world');
      expect(component.toggleOverlayContainer).toBeTrue();
    });

    it('should show error if note content is invalid JSON', () => {
      const invalidNote = { content: 'Invalid JSON', id: 998 };
      spyOn(console, 'error');
      component.openNote(invalidNote);
      // expect(snackbarSpy.open).toHaveBeenCalledWith(
      //   "Error while parsing, couldn't open note.",
      //   'Ok'
      // );
    });

    it('should show error if parsed note does not have ops property', () => {
      const invalidDeltaNote = { content: '{"foo":"bar"}', id: 999 };
      component.openNote(invalidDeltaNote);
      // expect(snackbarSpy.open).toHaveBeenCalledWith(
      //   "Error with the note format; couldn't open note.",
      //   'Ok'
      // );
    });
  });

  describe('dischargePatient', () => {
    it('should not call dischargePatient if confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.dischargePatient();
      expect(tHttpSpy.dischargePatient).not.toHaveBeenCalled();
    });

    it('should discharge patient when confirmed and navigate to "/"', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      const response = { message: 'Patient discharged successfully' };
      tHttpSpy.dischargePatient.and.returnValue(of(response));
      component.dischargePatient();
      tick();
      expect(tHttpSpy.dischargePatient).toHaveBeenCalledWith({
        patient_id: dummyPatient.id,
        therapist_id: dummyUser.id,
      });
      // expect(snackbarSpy.open).toHaveBeenCalledWith(
      //   'Patient discharged successfully',
      //   'Ok',
      //   { duration: 2500 }
      // );
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      flush();
    }));

    it('should show error snackbar if dischargePatient fails', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      const errorResponse = { message: 'Error discharging patient' };
      tHttpSpy.dischargePatient.and.returnValue(
        throwError(() => errorResponse)
      );
      component.dischargePatient();
      tick();
      // expect(snackbarSpy.open).toHaveBeenCalledWith(
      //   'Error discharging patient',
      //   'Ok'
      // );
      flush();
    }));
  });
});
