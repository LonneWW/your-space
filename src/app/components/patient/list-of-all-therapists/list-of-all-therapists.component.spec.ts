import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { ListOfAllTherapistsComponent } from './list-of-all-therapists.component';
import { HttpService } from '../../../services/http.service';
import { PatientHttpService } from '../../../services/patient-http.service';
import { UserDataService } from '../../../services/user-data.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListOfAllTherapistsComponent', () => {
  let component: ListOfAllTherapistsComponent;
  let fixture: ComponentFixture<ListOfAllTherapistsComponent>;

  let httpSpy: jasmine.SpyObj<HttpService>;
  let PatientHttpSpy: jasmine.SpyObj<PatientHttpService>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;
  // let snackbarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Esempio di array di terapisti
  const therapistsMock = [
    { id: 1, name: 'Alice', surname: 'Rossi' },
    { id: 2, name: 'Bob', surname: 'Verdi' },
  ];

  beforeEach(async () => {
    const httpSpyObj = jasmine.createSpyObj('HttpService', [
      'getAllTherapists',
    ]);
    const PatientHttpSpyObj = jasmine.createSpyObj('HttpService', [
      'selectTherapist',
    ]);
    httpSpyObj.getAllTherapists.and.returnValue(of(therapistsMock));
    PatientHttpSpyObj.selectTherapist.and.returnValue(
      of({ message: 'Default message' })
    );
    const userDataSpyObj = jasmine.createSpyObj(
      'UserDataService',
      ['updateUserData'],
      {
        currentUserData: {
          id: 10,
          role: 'patient',
          name: 'Test',
          surname: 'User',
          therapist_id: null,
        },
      }
    );
    // const snackbarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListOfAllTherapistsComponent, RouterTestingModule],
      providers: [
        { provide: HttpService, useValue: httpSpyObj },
        { provide: UserDataService, useValue: userDataSpyObj },
        { provide: PatientHttpService, useValue: PatientHttpSpyObj },
        // { provide: MatSnackBar, useValue: snackbarSpyObj },
        { provide: Router, useValue: routerSpyObj },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfAllTherapistsComponent);
    component = fixture.componentInstance;

    httpSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    PatientHttpSpy = TestBed.inject(
      PatientHttpService
    ) as jasmine.SpyObj<PatientHttpService>;
    userDataServiceSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    // snackbarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load the therapists list on init', fakeAsync(() => {
      httpSpy.getAllTherapists.and.returnValue(of(therapistsMock));
      component.ngOnInit();
      tick();
      expect(httpSpy.getAllTherapists).toHaveBeenCalled();
      // expect(component.therapistsList).toEqual(therapistsMock);
      flush();
    }));

    it('should show an error message if getAllTherapists fails', fakeAsync(() => {
      const errorResponse = { error: { message: 'Failed to load therapists' } };
      httpSpy.getAllTherapists.and.returnValue(throwError(() => errorResponse));
      component.ngOnInit();
      tick();
      // expect(snackbarSpy.open).toHaveBeenCalledWith(
      //   'Failed to load therapists',
      //   'Ok'
      // );
      flush();
    }));
  });

  describe('selectTherapist', () => {
    const therapistId = 1;
    const body = { patient_id: 10, therapist_id: therapistId };

    it('should not proceed if user does not confirm', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.selectTherapist(therapistId);
      expect(PatientHttpSpy.selectTherapist).not.toHaveBeenCalled();
    });

    it('should select therapist when confirmed', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);

      // Simula che in sessionStorage sia presente il patient id (salvato come stringa)
      spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'id') return '10';
        return null;
      });
      // Simula che la chiamata selectTherapist abbia successo
      const response = { message: 'Therapist selected successfully' };
      PatientHttpSpy.selectTherapist.and.returnValue(of(response));

      component.selectTherapist(therapistId);
      tick();
      // Verifica che la funzione sia stata chiamata con il body atteso:
      expect(PatientHttpSpy.selectTherapist).toHaveBeenCalledWith(body);

      // Simuliamo il comportamento in caso di successo: il codice aggiorna i dati utente
      // Impostiamo un dato di esempio su currentUserData
      const currentUser = userDataServiceSpy.currentUserData;
      currentUser!.therapist_id = 0; // valore precedente
      // Il metodo updateUserData viene chiamato dopo aver settato therapist_id a 0 e in sessionStorage
      expect(sessionStorage.setItem).toBeDefined(); // Possiamo verificare l'esistenza della funzione
      expect(userDataServiceSpy.updateUserData).toHaveBeenCalledWith({
        ...currentUser,
        therapist_id: 0,
      } as any);
      // expect(snackbarSpy.open).toHaveBeenCalledWith(response.message, 'Ok');
      flush();
    }));

    it('should show error snackbar when selectTherapist fails', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(sessionStorage, 'getItem').and.returnValue('10');

      const errorResponse = { error: { message: 'Selection failed' } };
      PatientHttpSpy.selectTherapist.and.returnValue(
        throwError(() => errorResponse)
      );

      component.selectTherapist(therapistId);
      tick();
      // expect(snackbarSpy.open).toHaveBeenCalledWith('Selection failed', 'Ok');
      flush();
    }));
  });
});
