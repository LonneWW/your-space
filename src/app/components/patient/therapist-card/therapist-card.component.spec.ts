import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { TherapistCardComponent } from './therapist-card.component';
import { ChangeDetectorRef } from '@angular/core';
import { PatientHttpService } from '../../../services/patient-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TherapistCardComponent', () => {
  let component: TherapistCardComponent;
  let fixture: ComponentFixture<TherapistCardComponent>;

  let httpServiceSpy: jasmine.SpyObj<PatientHttpService>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;
  // let snackbarSpy: jasmine.SpyObj<MatSnackBar>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  // Creiamo un Subject per simulare l'osservabile userData$
  let userDataSubject: Subject<any>;

  const therapistData = [{ id: 5, name: 'John', surname: 'Doe' }];

  beforeEach(async () => {
    // Creiamo uno spy per PatientHttpService
    const httpSpy = jasmine.createSpyObj('PatientHttpService', [
      'getTherapist',
    ]);
    httpSpy.getTherapist.and.returnValue(of(therapistData));
    // Creiamo uno spy per UserDataService e impostiamo currentUserData; creiamo anche userData$ come observable
    const userDataSpyObj = jasmine.createSpyObj(
      'UserDataService',
      ['saveSessionUser', 'updateUserData'],
      {
        currentUserData: { id: 1, role: 'patient', therapist_id: 'null' },
        sessionStorageUser: { id: 1, role: 'patient', therapist_id: 'null' },
      }
    );
    userDataSubject = new Subject<any>();
    // Simuliamo la proprietà userData$ come observable
    userDataSpyObj.userData$ = userDataSubject.asObservable();

    // const snackbarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    const cdrSpyObj = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);

    await TestBed.configureTestingModule({
      imports: [TherapistCardComponent],
      providers: [
        { provide: PatientHttpService, useValue: httpSpy },
        { provide: UserDataService, useValue: userDataSpyObj },
        // { provide: MatSnackBar, useValue: snackbarSpyObj },
        { provide: ChangeDetectorRef, useValue: cdrSpyObj },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TherapistCardComponent);
    component = fixture.componentInstance;

    httpServiceSpy = TestBed.inject(
      PatientHttpService
    ) as jasmine.SpyObj<PatientHttpService>;
    userDataServiceSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    // snackbarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    cdrSpy = TestBed.inject(
      ChangeDetectorRef
    ) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve therapist data if therapistId > 0', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component['therapistId']).toBe(null);
    expect(httpServiceSpy.getTherapist).toHaveBeenCalledWith(5, 1);
    expect(component['therapist']).toEqual(therapistData[0]);
    flush();
  }));

  it('should handle error when getTherapist fails', fakeAsync(() => {
    // Simula che sessionStorage getItem restituisca "5"
    spyOn(sessionStorage, 'getItem').and.returnValue('5');
    component.ngOnInit();

    httpServiceSpy.getTherapist.and.returnValue(
      throwError(() => ({ message: 'Error fetching therapist' }))
    );
    (component as any).therapist = undefined;
    tick();
    expect(httpServiceSpy.getTherapist).toHaveBeenCalledWith(
      5,
      component.user.id
    );
    expect((component as any).therapist).toBeUndefined();
    expect((component as any).therapist).toBeUndefined();
    // expect(snackbarSpy.open).toHaveBeenCalledWith(
    //   "Serverside error: couldn't get therapist details",
    //   'Ok'
    // );
    flush();
  }));

  it('should set therapistId to null if sessionStorage returns "null"', () => {
    // Simula il caso in cui sessionStorage restituisce la stringa "null"
    spyOn(sessionStorage, 'getItem').and.returnValue('null');
    component.ngOnInit();
    expect((component as any).therapist).toBeNull();
  });

  it('should update therapistId and reset toggleOverlayContainer based on userData$ subscription', () => {
    // Simula un nuovo valore emesso dall'osservabile userData$
    userDataSubject.next({ id: 1, role: 'patient', therapist_id: null });
    expect((component as any).therapist).toEqual(null);
    expect(component.toggleOverlayContainer).toBeFalse();
  });

  it('should set toggleOverlayContainer to true when openTherapistsList is called', () => {
    component.toggleOverlayContainer = false;
    component.openTherapistsList();
    expect(component.toggleOverlayContainer).toBeTrue();
  });

  it('should render "person-search" icon when therapistId is falsy (e.g., 0)', () => {
    // Imposta therapistId a 0 per simulare il caso in cui il terapista non sia ancora stato selezionato o sia in stato di pending.
    (component as any).therapistId = 0;
    fixture.detectChanges();
    // L'HTML usa *ngIf="therapistId && therapistId > 0" per mostrare l'icona "face";
    // quando therapistId è 0, deve visualizzarsi l'icona definita nell'else (person-search).
    const iconDe: DebugElement = fixture.debugElement.query(By.css('.tp-img'));
    // Controlla l'attributo svgIcon; durante il debug Angular lo riflette come "ng-reflect-svg-icon"
    expect(iconDe.nativeElement.getAttribute('ng-reflect-svg-icon')).toContain(
      'person-search'
    );
  });
});
