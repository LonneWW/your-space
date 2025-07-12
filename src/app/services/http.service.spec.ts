import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('HttpService', () => {
  let service: HttpService;
  let httpTestingController: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Creiamo uno spy per AuthService che finga il metodo checkCredentials.
    const authSpy = jasmine.createSpyObj('AuthService', ['checkCredentials']);

    TestBed.configureTestingModule({
      providers: [
        HttpService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(HttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    // Assicuriamoci che non ci siano richieste HTTP pendenti.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPatient', () => {
    it('should call the correct URL using GET', () => {
      const testId = 5;
      const mockResponse = { id: testId, name: 'Test Patient' };

      service.getPatient(testId).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `http://localhost:3000/patient/${testId}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });
  });

  describe('getTherapist', () => {
    it('should call the correct URL using GET', () => {
      const testId = 10;
      const mockResponse = { id: testId, name: 'Test Therapist' };

      service.getTherapist(testId).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `http://localhost:3000/therapist/${testId}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });
  });

  describe('getAllTherapists', () => {
    it('should call the correct URL using GET', () => {
      const testId = 5;
      const mockResponse = [
        { id: 1, name: 'Therapist 1' },
        { id: 2, name: 'Therapist 2' },
      ];

      service.getAllTherapists(testId).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `http://localhost:3000/patient/therapists?patient_id=${testId}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });
  });
});
