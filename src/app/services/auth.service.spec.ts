import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserDataService } from './user-data.service';
import { CredentialsMatchService } from './credentials-match.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        UserDataService,
        CredentialsMatchService,
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register a user', () => {
    const mockResponse = { success: true };
    const body = {
      name: 'Mario',
      surname: 'Rossi',
      email: 'mario@rossi.com',
      password: '123456',
      role: 'patient',
    };

    service.registerUser(body).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/auth/register/patient'
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login a user', () => {
    const mockLoginResponse = {
      id: 1,
      name: 'Mario',
      surname: 'Rossi',
      therapist_id: 0,
    };
    const body = {
      email: 'mario@rossi.com',
      password: '123456',
      role: 'patient',
    };

    service.loginUser(body).subscribe((response) => {
      expect(response).toEqual(mockLoginResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login/patient');
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);
  });

  it('should call isLoggedIn with the correct query string', () => {
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      switch (key) {
        case 'id':
          return '1';
        case 'name':
          return 'Mario';
        case 'surname':
          return 'Rossi';
        case 'role':
          return 'patient';
        default:
          return null;
      }
    });

    service.isLoggedIn().subscribe();
    const req = httpMock.expectOne(
      'http://localhost:3000/auth?id=1&name=Mario&surname=Rossi&role=patient'
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should clear session and navigate to /login when logging out', () => {
    spyOn(sessionStorage, 'clear');
    service.logout();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
