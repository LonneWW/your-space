import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { CredentialsMatchService } from '../../services/credentials-match.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;
  let routerSpy: jasmine.SpyObj<Router>;
  // let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let credMatchServiceSpy: jasmine.SpyObj<CredentialsMatchService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['loginUser']);
    const userDataSpy = jasmine.createSpyObj('UserDataService', [
      'saveSessionUser',
      'updateUserData',
    ]);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    // const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const credSpy = jasmine.createSpyObj('CredentialsMatchService', [
      'normalizeUser',
      'deepEqual',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UserDataService, useValue: userDataSpy },
        { provide: Router, useValue: rSpy },
        // { provide: MatSnackBar, useValue: snackSpy },
        { provide: CredentialsMatchService, useValue: credSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userDataServiceSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    // snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    credMatchServiceSpy = TestBed.inject(
      CredentialsMatchService
    ) as jasmine.SpyObj<CredentialsMatchService>;

    // Visto che sono utilizzati dei valori di default, possiamo lasciarli oppure settarli manualmente
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('loginUser (success scenario)', () => {
    it('should login as patient successfully and navigate accordingly', fakeAsync(() => {
      // Impostiamo il form con i dati di login, includendo il ruolo 'patient'
      component.loginForm.setValue({
        email: 'test@mail.com',
        password: 'TestPassword123!',
        role: 'patient',
      });

      // Simuliamo la risposta del service
      const mockResponse = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        therapist_id: 99,
      };
      authServiceSpy.loginUser.and.returnValue(of(mockResponse));

      // Invochiamo la funzione di login
      component.loginUser();
      tick();

      // Verifichiamo che loginUser sia stato chiamato con il valore del form
      expect(authServiceSpy.loginUser).toHaveBeenCalledWith(
        component.loginForm.value
      );

      // Verifichiamo che userDataService salvino e aggiornino i dati
      expect(userDataServiceSpy.saveSessionUser).toHaveBeenCalled();
      expect(userDataServiceSpy.updateUserData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          id: 1,
          name: 'John',
          surname: 'Doe',
          role: 'patient',
          therapist_id: 99,
        })
      );

      // Verifichiamo la chiamata al MatSnackBar per il successo
      // expect(snackBarSpy.open).toHaveBeenCalledWith(
      //   'Logged in successfully',
      //   'Ok',
      //   { duration: 3000 }
      // );
      // In base al ruolo "patient", il routing avviene verso "/patient"
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/patient']);
    }));

    it('should login as therapist successfully and navigate accordingly', fakeAsync(() => {
      // Impostiamo il form con il ruolo 'therapist'
      component.loginForm.setValue({
        email: 'therapist@mail.com',
        password: 'TestPassword123!',
        role: 'therapist',
      });

      const mockResponse = {
        id: 2,
        name: 'Alice',
        surname: 'Smith',
        therapist_id: 0,
      };
      authServiceSpy.loginUser.and.returnValue(of(mockResponse));

      component.loginUser();
      tick();

      expect(authServiceSpy.loginUser).toHaveBeenCalledWith(
        component.loginForm.value
      );
      expect(userDataServiceSpy.saveSessionUser).toHaveBeenCalled();
      expect(userDataServiceSpy.updateUserData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          id: 2,
          name: 'Alice',
          surname: 'Smith',
          role: 'therapist',
        })
      );
      // expect(snackBarSpy.open).toHaveBeenCalledWith(
      //   'Logged in successfully',
      //   'Ok',
      //   { duration: 3000 }
      // );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/therapist']);
    }));
  });

  describe('loginUser (error scenarios)', () => {
    it('should display an error message and reset password on 401 error', fakeAsync(() => {
      component.loginForm.setValue({
        email: 'test@mail.com',
        password: 'TestPassword123!',
        role: 'patient',
      });

      const errorResponse = { error: { status: 401, message: 'Unauthorized' } };
      authServiceSpy.loginUser.and.returnValue(throwError(() => errorResponse));

      // Stabilisco un riferimento al controllo della password
      const passwordControl = component.loginForm.controls['password'];

      component.loginUser();
      tick();

      // Verifichiamo che venga aperto il MatSnackBar con il messaggio di errore
      // expect(snackBarSpy.open).toHaveBeenCalledWith('Unauthorized', 'Ok');
      // Per status 401, la logica prevede di svuotare il campo password.
      expect(passwordControl.value).toEqual('');
      // Possiamo anche verificare che il controllo sia stato marcato come "untouched" e "pristine"
      expect(passwordControl.pristine).toBeTrue();
    }));

    it('should clear email and password on 404 error', fakeAsync(() => {
      component.loginForm.setValue({
        email: 'test@mail.com',
        password: 'TestPassword123!',
        role: 'patient',
      });

      const errorResponse = { error: { status: 404, message: 'Not Found' } };
      authServiceSpy.loginUser.and.returnValue(throwError(() => errorResponse));

      const emailControl = component.loginForm.controls['email'];
      const passwordControl = component.loginForm.controls['password'];

      component.loginUser();
      tick();

      // expect(snackBarSpy.open).toHaveBeenCalledWith('Not Found', 'Ok');
      expect(emailControl.value).toEqual('');
      expect(passwordControl.value).toEqual('');
    }));

    it('should reset the form on other errors', fakeAsync(() => {
      component.loginForm.setValue({
        email: 'therapist@mail.com',
        password: 'TestPassword123!',
        role: 'therapist',
      });

      const errorResponse = { error: { status: 500, message: 'Server error' } };
      authServiceSpy.loginUser.and.returnValue(throwError(() => errorResponse));

      spyOn(component.loginForm, 'reset');

      component.loginUser();
      tick();

      // expect(snackBarSpy.open).toHaveBeenCalledWith('Server error', 'Ok');
      expect(component.loginForm.reset).toHaveBeenCalled();
    }));
  });

  afterEach(() => {
    // Completiamo il Subject per evitare memory leak
    component.ngOnDestroy();
  });
});
