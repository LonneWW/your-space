import { TestBed } from '@angular/core/testing';
import { TherapistHttpService } from './therapist-http.service';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('TherapistHttpService', () => {
  let service: TherapistHttpService;
  let httpTestingController: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Creiamo uno spy per AuthService, fittizzando il metodo checkCredentials
    const authSpy = jasmine.createSpyObj('AuthService', ['checkCredentials']);

    TestBed.configureTestingModule({
      providers: [
        TherapistHttpService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(TherapistHttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getPatients', () => {
    it('should retrieve patients data with GET', () => {
      const therapistId = 1;
      const mockResponse = [
        { id: 101, name: 'Patient A' },
        { id: 102, name: 'Patient B' },
      ];

      service.getPatients(therapistId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const expectedUrl = `http://localhost:3000/therapist/patients?therapist_id=${therapistId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getNotes', () => {
    it('should build the correct endpoint without filters', () => {
      const therapistId = 2;
      const mockResponse = { data: 'notes list' };

      service.getNotes(therapistId).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const expectedUrl = `http://localhost:3000/therapist/notes?therapist_id=${therapistId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should build the correct endpoint with filters', () => {
      const therapistId = 3;
      const filters = {
        note_id: 20,
        title: 'Session',
        tag: 'urgent',
        dateFrom: 10000,
        dateTo: 20000,
      };
      const mockResponse = { data: 'filtered notes' };

      service.getNotes(therapistId, filters).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      // Verifica che l'URL contenga tutti i parametri, codificati correttamente
      const req = httpTestingController.expectOne((request) => {
        return (
          request.url === 'http://localhost:3000/therapist/notes' &&
          request.params.get('therapist_id') === therapistId.toString() &&
          request.params.get('note_id') === filters.note_id.toString() &&
          request.params.get('title') === filters.title &&
          request.params.get('tag') === filters.tag &&
          request.params.get('dateFrom') === filters.dateFrom.toString() &&
          request.params.get('dateTo') === filters.dateTo.toString()
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getPatientNotes', () => {
    it('should call the correct endpoint for patient notes', () => {
      const therapistId = 4;
      const patientId = 5;
      const mockResponse = { data: 'patient notes' };

      service
        .getPatientNotes(therapistId, patientId)
        .subscribe((response: any) => {
          expect(response).toEqual(mockResponse);
        });

      const expectedUrl = `http://localhost:3000/therapist/patient-notes?therapist_id=${therapistId}&patient_id=${patientId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getNotesAboutPatient', () => {
    it('should call the correct endpoint for notes about a patient', () => {
      const therapistId = 6;
      const patientId = 7;
      const mockResponse = { data: 'notes about patient' };

      service
        .getNotesAboutPatient(patientId, therapistId)
        .subscribe((response: any) => {
          expect(response).toEqual(mockResponse);
        });

      const expectedUrl = `http://localhost:3000/therapist/notes-about-patient?therapist_id=${therapistId}&patient_id=${patientId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getNotifications', () => {
    it('should retrieve notifications for the therapist with GET', () => {
      const therapistId = 8;
      const mockResponse = { notifications: [] };

      service.getNotifications(therapistId).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const expectedUrl = `http://localhost:3000/therapist/notifications?therapist_id=${therapistId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('postNote', () => {
    it('should call checkCredentials and POST a note', () => {
      const body = {
        title: 'New Note',
        content: JSON.parse('{"text":"Note content"}'),
        patient_id: 9,
        therapist_id: 10,
        tags: JSON.parse('{"tag":"general"}'),
      };
      const mockResponse = { success: true };

      service.postNote(body).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });
      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/therapist/notes`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('postNotification', () => {
    it('should call checkCredentials and POST a notification', () => {
      const body = {
        content: 'Alert Message',
        patient_id: 11,
        therapist_id: 12,
      };
      const mockResponse = { success: true };

      service.postNotification(body).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });
      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/therapist/notifications`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('modifyNote', () => {
    it('should call checkCredentials and PUT to modify a note', () => {
      const body = {
        title: 'Updated Note',
        content: JSON.parse('{"text": "Updated content"}'),
        therapist_id: 13,
        tags: JSON.parse('{"tag": "updated"}'),
        note_id: 14,
      };
      const mockResponse = { success: true };

      service.modifyNote(body).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });
      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/therapist/notes`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('acceptPatient', () => {
    it('should call checkCredentials and PUT to accept a patient', () => {
      const body = { patient_id: 15, therapist_id: 16 };
      const mockResponse = { success: true };

      service.acceptPatient(body).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/therapist/accept-patient`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('dischargePatient', () => {
    it('should call checkCredentials and PUT to discharge a patient', () => {
      const body = { patient_id: 17, therapist_id: 18 };
      const mockResponse = { success: true };

      service.dischargePatient(body).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/therapist/discharge-patient`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('deleteNote', () => {
    it('should call checkCredentials and DELETE a note', () => {
      const noteId = 19;
      const therapistId = 20;
      const mockResponse = { success: true };

      service.deleteNote(noteId, therapistId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/therapist/notes?therapist_id=${therapistId}&note_id=${noteId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('deleteNotification', () => {
    it('should call checkCredentials and DELETE a notification', () => {
      const notificationId = 21;
      const mockResponse = { success: true };

      service.deleteNotification(notificationId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
      expect(authServiceSpy.checkCredentials).toHaveBeenCalled();
      const expectedUrl = `http://localhost:3000/therapist/notifications?notification_id=${notificationId}`;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
