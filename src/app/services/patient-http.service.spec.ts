import { TestBed } from '@angular/core/testing';
import { PatientHttpService } from './patient-http.service';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('PatientHttpService', () => {
  let service: PatientHttpService;
  let httpTestingController: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Creiamo uno spy per AuthService, che finge il metodo checkCredentials.
    const authSpy = jasmine.createSpyObj('AuthService', ['checkCredentials']);

    TestBed.configureTestingModule({
      providers: [
        PatientHttpService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(PatientHttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    // Verifichiamo che non ci siano richieste HTTP pendenti dopo ogni test.
    httpTestingController.verify();
  });

  describe('getNotes', () => {
    it('should build the correct endpoint without filters', () => {
      const patientId = 1;
      const mockResponse = { data: 'some notes' };

      service.getNotes(patientId).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const expectedUrl = `http://localhost:3000/patient/notes?patient_id=${patientId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should build the correct endpoint with filters', () => {
      const patientId = 2;
      const filters = {
        note_id: 10,
        title: 'test note',
        tag: 'important',
        dateFrom: 12345,
        dateTo: 67890,
      };
      const mockResponse = { data: 'filtered notes' };

      service.getNotes(patientId, filters).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      // Verifichiamo che l'URL contenga tutti i parametri di query correttamente codificati.
      const req = httpTestingController.expectOne((request) => {
        return (
          request.url.includes('/patient/notes') &&
          request.url.includes(`patient_id=${patientId}`) &&
          request.url.includes(`note_id=${filters.note_id}`) &&
          request.url.includes(`title=${encodeURIComponent(filters.title)}`) &&
          request.url.includes(`tag=${encodeURIComponent(filters.tag)}`) &&
          request.url.includes(`dateFrom=${filters.dateFrom}`) &&
          request.url.includes(`dateTo=${filters.dateTo}`)
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getNotifications', () => {
    it('should call the correct URL using GET', () => {
      const patientId = 3;
      const mockResponse = { notifications: [] };

      service.getNotifications(patientId).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const expectedUrl = `http://localhost:3000/patient/notifications?patient_id=${patientId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('postNote', () => {
    it('should call checkCredentials and POST to the correct URL', () => {
      const noteBody = {
        title: 'My Note',
        content: JSON.stringify({ text: 'Note content' }),
        tags: null,
        patient_id: 4,
      };
      const mockResponse = { success: true };

      service.postNote(noteBody).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      // Verifichiamo che venga chiamato checkCredentials
      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();

      const expectedUrl = `http://localhost:3000/patient/notes`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(noteBody);
      req.flush(mockResponse);
    });
  });

  describe('postNotification', () => {
    it('should call checkCredentials and POST to the correct URL', () => {
      const notificationBody = {
        content: 'New Notification',
        patient_id: 5,
      };
      const mockResponse = { success: true };

      service.postNotification(notificationBody).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/patient/notifications`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(notificationBody);
      req.flush(mockResponse);
    });
  });

  describe('selectTherapist', () => {
    it('should call checkCredentials and PUT to the correct URL', () => {
      const body = { patient_id: 6, therapist_id: 7 };
      const mockResponse = { success: true };

      service.selectTherapist(body).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/patient/select-therapist`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('dischargeTherapist', () => {
    it('should call checkCredentials and PUT to the correct URL for discharging therapist', () => {
      const body = { patient_id: 8, therapist_id: 9 };
      const mockResponse = { success: true };

      service.dischargeTherapist(body).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/patient/unlink-therapist`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('modifyNote', () => {
    it('should call checkCredentials and PUT to update a note', () => {
      const noteBody = {
        title: 'Updated Title',
        note_id: 10,
        content: JSON.stringify({ text: 'Updated content' }),
        tags: null,
        patient_id: 11,
      };
      const mockResponse = { success: true };

      service.modifyNote(noteBody).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/patient/notes`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(noteBody);
      req.flush(mockResponse);
    });
  });

  describe('changeNoteVisibility', () => {
    it('should call checkCredentials and PUT to change note visibility', () => {
      const visibilityBody = {
        note_id: 12,
        shared: 1,
        patient_id: 13,
      };
      const mockResponse = { success: true };

      service
        .changeNoteVisibility(visibilityBody)
        .subscribe((response: any) => {
          expect(response).toEqual(mockResponse);
        });

      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/patient/notes/visibility`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(visibilityBody);
      req.flush(mockResponse);
    });
  });

  describe('deleteNote', () => {
    it('should call checkCredentials and DELETE the note with correct query parameters', () => {
      const noteId = 14;
      const patientId = 15;
      const mockResponse = { success: true };

      service.deleteNote(noteId, patientId).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/patient/notes?patient_id=${patientId}&note_id=${noteId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('deleteNotification', () => {
    it('should call checkCredentials and DELETE the notification', () => {
      const testId = 5;
      const notificationId = 16;
      const mockResponse = { success: true };

      service
        .deleteNotification(notificationId, testId)
        .subscribe((response: any) => {
          expect(response).toEqual(mockResponse);
        });

      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/patient/notifications?notification_id=${notificationId}&patient_id=${testId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
