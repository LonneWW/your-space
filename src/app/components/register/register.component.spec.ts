import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;
  let routerSpy: jasmine.SpyObj<Router>;
  // let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Creiamo gli spy per i service usati dal componente.
    const authSpy = jasmine.createSpyObj('AuthService', ['registerUser']);
    const userDataSpy = jasmine.createSpyObj('UserDataService', [
      'saveSessionUser',
      'updateUserData',
    ]);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    // const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      // Utilizziamo il componente standalone e il RouterTestingModule.
      imports: [RegisterComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UserDataService, useValue: userDataSpy },
        { provide: Router, useValue: rSpy },
        // { provide: MatSnackBar, useValue: snackSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userDataServiceSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    // snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('registerUser (success scenario)', () => {
    it('should register a patient and navigate accordingly', fakeAsync(() => {
      // Imposta il form con valori validi
      component.registerForm.setValue({
        name: 'Test',
        surname: 'Testone',
        email: 'nu@va.it',
        password: 'IoSonoLaPasswordDiProva11!',
        confirmPassword: 'IoSonoLaPasswordDiProva11!',
        role: 'patient',
      });

      // Scegli un mockResponse che sia un array con un oggetto al primo indice
      const mockResponse = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        therapist_id: 99,
      };
      authServiceSpy.registerUser.and.returnValue(of([mockResponse]));

      // Chiama registerUser() e simula il passaggio del tempo
      component.registerUser();
      tick();

      // Ora ci aspettiamo che lo snackbar venga chiamato con il messaggio corretto
      // expect(snackBarSpy.open).toHaveBeenCalledWith(
      //   'Registration has been successful',
      //   'Ok',
      //   { duration: 3000 }
      // );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/patient']);
      flush();
    }));

    it('should register a therapist and navigate accordingly', fakeAsync(() => {
      // Impostiamo il form per un account "therapist"
      component.registerForm.setValue({
        name: 'Test',
        surname: 'Testone',
        email: 'nu@va.it',
        password: 'IoSonoLaPasswordDiProva11!',
        confirmPassword: 'IoSonoLaPasswordDiProva11!',
        role: 'therapist',
      });

      const mockResponse = [
        { id: 20, name: 'Alice', surname: 'Smith', therapist_id: 0 },
      ];
      authServiceSpy.registerUser.and.returnValue(of(mockResponse));

      component.registerUser();
      tick();

      expect(authServiceSpy.registerUser).toHaveBeenCalledWith(
        component.registerForm.value
      );
      expect(userDataServiceSpy.saveSessionUser).toHaveBeenCalled();
      expect(userDataServiceSpy.updateUserData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          id: 20,
          name: 'Alice',
          surname: 'Smith',
          role: 'therapist',
        })
      );
      // expect(snackBarSpy.open).toHaveBeenCalledWith(
      //   'Registration has been successful',
      //   'Ok',
      //   { duration: 3000 }
      // );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/therapist']);
    }));
  });

  describe('registerUser (error scenario)', () => {
    it('should display an error and reset the form', fakeAsync(() => {
      component.registerForm.setValue({
        name: 'Test',
        surname: 'Testone',
        email: 'nu@va.it',
        password: 'IoSonoLaPasswordDiProva11!',
        confirmPassword: 'IoSonoLaPasswordDiProva11!',
        role: 'patient',
      });

      const errorResponse = { error: { message: 'Registration failed' } };
      authServiceSpy.registerUser.and.returnValue(
        throwError(() => errorResponse)
      );

      // Creiamo uno spy sul metodo reset del form
      spyOn(component.registerForm, 'reset');

      component.registerUser();
      tick();

      // expect(snackBarSpy.open).toHaveBeenCalledWith(
      //   errorResponse.error.message ||
      //     'Something went wrong while browsing the application',
      //   'Ok'
      // );
      expect(component.registerForm.reset).toHaveBeenCalled();
    }));
  });

  afterEach(() => {
    // Per evitare memory leak, completiamo il Subject
    component.ngOnDestroy();
  });
});
