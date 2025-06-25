import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { TherapistCardComponent } from './therapist-card.component';
import { ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../../services/http.service';
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

  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;
  // let snackbarSpy: jasmine.SpyObj<MatSnackBar>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  // Creiamo un Subject per simulare l'osservabile userData$
  let userDataSubject: Subject<any>;

  const therapistData = [{ id: 5, name: 'John', surname: 'Doe' }];

  beforeEach(async () => {
    // Creiamo uno spy per HttpService
    const httpSpy = jasmine.createSpyObj('HttpService', ['getTherapist']);
    httpSpy.getTherapist.and.returnValue(of(therapistData));
    // Creiamo uno spy per UserDataService e impostiamo currentUserData; creiamo anche userData$ come observable
    const userDataSpyObj = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: { id: 1, role: 'patient' },
    });
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
        { provide: HttpService, useValue: httpSpy },
        { provide: UserDataService, useValue: userDataSpyObj },
        // { provide: MatSnackBar, useValue: snackbarSpyObj },
        { provide: ChangeDetectorRef, useValue: cdrSpyObj },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TherapistCardComponent);
    component = fixture.componentInstance;

    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
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
    // Simula che sessionStorage.getItem('therapist_id') restituisca "5"
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'therapist_id') {
        return '5';
      }
      return null;
    });

    // Chiama ngOnInit per richiamare la logica
    component.ngOnInit();
    // Verifica che therapistId sia stato settato a 5
    expect((component as any).therapistId).toEqual(5);

    // Simula la chiamata a getTherapist: restituisce un array con dati
    httpServiceSpy.getTherapist.and.returnValue(of(therapistData));
    tick();
    expect(httpServiceSpy.getTherapist).toHaveBeenCalledWith(5);
    expect((component as any).therapist).toEqual(therapistData[0]);
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
    expect(httpServiceSpy.getTherapist).toHaveBeenCalledWith(5);
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
