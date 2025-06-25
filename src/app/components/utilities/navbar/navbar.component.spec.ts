import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { OverlayContainerComponent } from '../overlay-container/overlay-container.component';
import { AuthService } from '../../../services/auth.service';
import { UserDataService } from '../../../services/user-data.service';
import { PatientHttpService } from '../../../services/patient-http.service';
import { TherapistHttpService } from '../../../services/therapist-http.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;
  let pHttpSpy: jasmine.SpyObj<PatientHttpService>;
  let tHttpSpy: jasmine.SpyObj<TherapistHttpService>;
  // let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Creazione degli spy per i vari servizi
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const userDataSpyObj = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: { id: 1, role: 'patient' },
    });
    const patientHttpSpy = jasmine.createSpyObj('PatientHttpService', [
      'getNotifications',
      'deleteNotification',
    ]);
    const therapistHttpSpy = jasmine.createSpyObj('TherapistHttpService', [
      'getNotifications',
      'deleteNotification',
      'acceptPatient',
      'dischargePatient',
    ]);
    // const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      // Includiamo i componenti standalone
      imports: [NavbarComponent, OverlayContainerComponent],
      providers: [
        // Includiamo il provider del router usando provideRouter.
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },
        { provide: UserDataService, useValue: userDataSpyObj },
        { provide: PatientHttpService, useValue: patientHttpSpy },
        { provide: TherapistHttpService, useValue: therapistHttpSpy },
        // { provide: MatSnackBar, useValue: snackBarSpyObj },
      ],
    }).compileComponents();

    // Creazione del componente
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    // Simuliamo le risposte ai metodi nelle chiamate di ngOnInit
    patientHttpSpy.getNotifications.and.returnValue(
      of([{ id: 100, content: 'Test notification', patient_id: 1 }])
    );
    therapistHttpSpy.getNotifications.and.returnValue(of([]));

    fixture.detectChanges();

    // Iniezione degli spy tramite TestBed
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userDataServiceSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    pHttpSpy = TestBed.inject(
      PatientHttpService
    ) as jasmine.SpyObj<PatientHttpService>;
    tHttpSpy = TestBed.inject(
      TherapistHttpService
    ) as jasmine.SpyObj<TherapistHttpService>;
    // snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle overlay container when notifications button is clicked', () => {
    // Supponiamo che il pulsante delle notifiche abbia l'ID "notifications-fab"
    const notifButton = fixture.debugElement.query(
      By.css('#notifications-fab')
    ).nativeElement;
    expect(component.toggleOverlayContainer).toBeFalse();
    notifButton.click();
    fixture.detectChanges();
    expect(component.toggleOverlayContainer).toBeTrue();
  });

  it('should call logout when logout button is clicked and confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should not call logout if confirm returns false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.logout();
    expect(authServiceSpy.logout).not.toHaveBeenCalled();
  });

  describe('ngOnInit notifications', () => {
    it('should get notifications using PatientHttpService if role is patient', fakeAsync(() => {
      component.ngOnInit();
      tick();
      expect(pHttpSpy.getNotifications).toHaveBeenCalledWith(1);
      expect(component.notifications.length).toBe(1);
      flush();
    }));

    it('should get notifications using TherapistHttpService if role is therapist', fakeAsync(() => {
      // Simuliamo un utente di ruolo "therapist"
      Object.defineProperty(userDataServiceSpy, 'currentUserData', {
        get: () => ({ id: 2, role: 'therapist' }),
      });
      component.ngOnInit();
      tick();
      expect(tHttpSpy.getNotifications).toHaveBeenCalledWith(2);
      flush();
    }));
  });

  describe('closeNotification', () => {
    it('should call PatientHttpService.deleteNotification when role is patient', fakeAsync(() => {
      pHttpSpy.deleteNotification.and.returnValue(of({ success: true }));
      component.notifications = [
        { id: 101, content: 'Notification', patient_id: 1 },
      ];
      component.closeNotification(101, 'patient');
      tick();
      expect(pHttpSpy.deleteNotification).toHaveBeenCalledWith(101);
      expect(component.notifications.length).toBe(0);
      flush();
    }));

    it('should call TherapistHttpService.deleteNotification when role is therapist', fakeAsync(() => {
      tHttpSpy.deleteNotification.and.returnValue(of({ success: true }));
      component.notifications = [
        { id: 102, content: 'Notification', patient_id: 1 },
      ];
      component.closeNotification(102, 'therapist');
      tick();
      expect(tHttpSpy.deleteNotification).toHaveBeenCalledWith(102);
      expect(component.notifications.length).toBe(0);
      flush();
    }));
  });

  describe('acceptPatient and rejectPatient', () => {
    it('should accept a patient and then delete the related notification', fakeAsync(() => {
      tHttpSpy.acceptPatient.and.returnValue(of({ success: true }));
      tHttpSpy.deleteNotification.and.returnValue(of({ success: true }));
      component.acceptPatient(10, 20, 105);
      tick();
      expect(tHttpSpy.acceptPatient).toHaveBeenCalledWith({
        patient_id: 10,
        therapist_id: 20,
      });
      tick();
      expect(tHttpSpy.deleteNotification).toHaveBeenCalled();
      // expect(snackBarSpy.open).toHaveBeenCalledWith(
      //   'Patient accepted successfully',
      //   'Ok',
      //   { duration: 2500 }
      // );
      flush();
    }));

    it('should reject a patient and then delete the related notification', fakeAsync(() => {
      tHttpSpy.dischargePatient.and.returnValue(
        of({ message: 'Patient discharged' })
      );
      tHttpSpy.deleteNotification.and.returnValue(of({ success: true }));
      component.rejectPatient(30, 40, 106);
      tick();
      expect(tHttpSpy.dischargePatient).toHaveBeenCalledWith({
        patient_id: 30,
        therapist_id: 40,
      });
      tick();
      expect(tHttpSpy.deleteNotification).toHaveBeenCalled();
      // expect(snackBarSpy.open).toHaveBeenCalledWith(
      //   'Patient discharged',
      //   'Ok',
      //   { duration: 2500 }
      // );
      flush();
    }));
  });
});
