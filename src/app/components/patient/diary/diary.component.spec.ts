import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { DiaryComponent } from './diary.component';
import { PatientHttpService } from '../../../services/patient-http.service';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Esempio di nota, conformemente alla nostra interfaccia INote
const sampleNotePatient = {
  id: 1,
  title: 'Diary note',
  content: 'Some patient note content',
  tags: '{}',
  patient_id: 10,
  date: Date.now(),
  shared: 0,
  therapist_id: null,
};

const sampleNoteTherapist = {
  id: 2,
  title: 'Therapist Diary note',
  content: 'Some therapist note content',
  tags: '{}',
  patient_id: 20,
  date: Date.now(),
  shared: 0,
  therapist_id: null,
};

describe('DiaryComponent', () => {
  let component: DiaryComponent;
  let fixture: ComponentFixture<DiaryComponent>;
  let pHttpSpy: jasmine.SpyObj<PatientHttpService>;
  let tHttpSpy: jasmine.SpyObj<TherapistHttpService>;
  let userDataSpy: jasmine.SpyObj<UserDataService>;
  // let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Creiamo gli spy per i servizi
    const patientHttpSpy = jasmine.createSpyObj('PatientHttpService', [
      'getNotes',
    ]);
    const therapistHttpSpy = jasmine.createSpyObj('TherapistHttpService', [
      'getNotes',
    ]);
    const userDataSpyObj = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: { id: 10, role: 'patient', name: 'Patient' },
    });
    // const snackbarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [DiaryComponent, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: PatientHttpService, useValue: patientHttpSpy },
        { provide: TherapistHttpService, useValue: therapistHttpSpy },
        { provide: UserDataService, useValue: userDataSpyObj },
        // { provide: MatSnackBar, useValue: snackbarSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  // Se il DiaryComponent si aspetta un parametro specifico,
                  // restituisci un valore adeguato. Se non serve, restituisci null.
                  // Ad es., se deve essere "patient" oppure il note id, puoi scegliere:
                  if (key === 'note_id') {
                    return '200';
                  }
                  return null;
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiaryComponent);
    component = fixture.componentInstance;

    pHttpSpy = TestBed.inject(
      PatientHttpService
    ) as jasmine.SpyObj<PatientHttpService>;
    tHttpSpy = TestBed.inject(
      TherapistHttpService
    ) as jasmine.SpyObj<TherapistHttpService>;
    userDataSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    // snackbarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  afterEach(() => {
    // Puliamo eventuali dati residui in sessionStorage
    sessionStorage.clear();
    component.ngOnDestroy();
  });

  describe('ngOnInit - Patient branch', () => {
    it('should assign note from PatientHttpService.getNotes on success', fakeAsync(() => {
      // Impostiamo l'utente come patient (già impostato dallo spy)
      const noteResponse = [sampleNotePatient];
      pHttpSpy.getNotes.and.returnValue(of(noteResponse));

      fixture.detectChanges();
      component.ngOnInit();
      tick();

      expect(pHttpSpy.getNotes).toHaveBeenCalledWith(10, { note_id: 1 });
      expect(component.note).toEqual(sampleNotePatient);
      flush();
    }));

    // it('should show snackbar error if PatientHttpService.getNotes fails', fakeAsync(() => {
    //   pHttpSpy.getNotes.and.returnValue(
    //     throwError(() => ({ message: 'Get note error' }))
    //   );

    //   fixture.detectChanges();
    //   component.ngOnInit();
    //   tick();

    //   expect(snackbarSpy.open).toHaveBeenCalledWith(
    //     'Serverside error: unable to save note.',
    //     'Ok'
    //   );
    //   flush();
    // }));
  });

  describe('ngOnInit - Therapist branch', () => {
    it('should assign note from TherapistHttpService.getNotes when user is therapist', fakeAsync(() => {
      // Simula un utente di ruolo "therapist"
      Object.defineProperty(userDataSpy, 'currentUserData', {
        get: () => ({
          id: 20,
          role: 'therapist',
          name: 'Therapist',
          surname: 'Zero',
        }),
      });

      const noteResponse = [sampleNoteTherapist];
      tHttpSpy.getNotes.and.returnValue(of(noteResponse));

      fixture.detectChanges();
      component.ngOnInit();
      tick();

      expect(tHttpSpy.getNotes).toHaveBeenCalledWith(20, { note_id: 1 });
      expect(component.note).toEqual(sampleNoteTherapist);
      flush();
    }));

    // it('should show snackbar error if TherapistHttpService.getNotes fails', fakeAsync(() => {
    //   Object.defineProperty(userDataSpy, 'currentUserData', {
    //     get: () => ({
    //       id: 20,
    //       role: 'therapist',
    //       name: 'Therapist',
    //       surname: 'Zero',
    //     }),
    //   });

    //   tHttpSpy.getNotes.and.returnValue(
    //     throwError(() => ({ message: 'Therapist get note error' }))
    //   );

    //   fixture.detectChanges();
    //   component.ngOnInit();
    //   tick();

    //   expect(snackbarSpy.open).toHaveBeenCalledWith(
    //     'Serverside error: unable to save note.',
    //     'Ok'
    //   );
    //   flush();
    // }));
  });
});
