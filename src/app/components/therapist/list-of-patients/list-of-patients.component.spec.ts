import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { ListOfPatientsComponent } from './list-of-patients.component';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListOfPatientsComponent', () => {
  let component: ListOfPatientsComponent;
  let fixture: ComponentFixture<ListOfPatientsComponent>;

  let tHttpSpy: jasmine.SpyObj<TherapistHttpService>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

  // Esempio di risposta da getPatients
  const patientsResponse = {
    patients: [
      { id: 101, name: 'Mario', surname: 'Rossi' },
      { id: 102, name: 'Luigi', surname: 'Verdi' },
    ],
  };

  beforeEach(async () => {
    // Creiamo uno spy per TherapistHttpService e UserDataService
    const tHttpSpyObj = jasmine.createSpyObj('TherapistHttpService', [
      'getPatients',
    ]);
    const userDataSpyObj = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: {
        id: 10,
        role: 'therapist',
        name: 'Test',
        surname: 'User',
        therapist_id: null,
      },
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const snackbarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ListOfPatientsComponent, RouterTestingModule],
      providers: [
        { provide: TherapistHttpService, useValue: tHttpSpyObj },
        { provide: UserDataService, useValue: userDataSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: MatSnackBar, useValue: snackbarSpyObj },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfPatientsComponent);
    component = fixture.componentInstance;

    // Impostiamo un valore di default per getPatients per evitare undefined.pipe()
    tHttpSpy = TestBed.inject(
      TherapistHttpService
    ) as jasmine.SpyObj<TherapistHttpService>;
    tHttpSpy.getPatients.and.returnValue(of({ patients: [] }));

    userDataServiceSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackbarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getPatients and assign patientsList when there are patients', fakeAsync(() => {
      tHttpSpy.getPatients.and.returnValue(of(patientsResponse));
      component.ngOnInit();
      tick();
      expect(tHttpSpy.getPatients).toHaveBeenCalledWith(
        userDataServiceSpy.currentUserData!.id
      );
      // Assicurati di verificare "patientsList" (plurale) e non "patientList"
      expect((component as any).patientsList).toEqual(
        patientsResponse.patients
      );
      flush();
    }));

    it('should show a snackbar error if getPatients fails', fakeAsync(() => {
      const errorResponse = {
        error: { message: 'Could not retrieve patients.' },
      };
      tHttpSpy.getPatients.and.returnValue(throwError(() => errorResponse));
      component.ngOnInit();
      tick();
      expect(snackbarSpy.open).toHaveBeenCalledWith(
        "Serverside error: couldn't get any patient.",
        'Ok'
      );
      flush();
    }));
  });

  describe('Template rendering', () => {
    it('should display a list of patient cards when patientsList is not empty', fakeAsync(() => {
      // Assegniamo l'array di pazienti alla proprietà corretta: "patientsList"
      (component as any).patientsList = patientsResponse.patients;
      fixture.detectChanges();
      tick();
      const cards = fixture.debugElement.queryAll(
        By.css('mat-card.feature-card')
      );
      // Dovremmo avere 2 schede: una per ciascun paziente
      expect(cards.length).toEqual(patientsResponse.patients.length);
      const firstCardText = cards[0].nativeElement.textContent;
      expect(firstCardText).toContain('Mario Rossi');
      flush();
    }));

    it('should display "No patients to show" when patientsList is empty', fakeAsync(() => {
      (component as any).patientsList = [];
      fixture.detectChanges();
      tick();
      const cardEl: HTMLElement = fixture.nativeElement.querySelector(
        'mat-card.feature-card'
      );
      expect(cardEl).toBeTruthy();
      expect(cardEl.textContent).toContain('No patients to show');
      flush();
    }));
  });

  describe('navigateToUserPage', () => {
    it('should navigate to the user page with correct state when a patient card is clicked', () => {
      const dummyPatient = { id: 101, name: 'Mario', surname: 'Rossi' };
      component.navigateToUserPage(dummyPatient);
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        [`therapist/patient/${dummyPatient.id}`],
        {
          state: { data: dummyPatient },
        }
      );
    });
  });
});
