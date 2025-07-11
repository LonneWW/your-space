import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TherapistHttpService {
  constructor(private http: HttpClient, private auth: AuthService) {}
  private url: string = environment.apiUrl;

  getPatients(therapist_id: number) {
    return this.http.get(
      this.url + '/therapist/patients?therapist_id=' + therapist_id
    );
  }

  getNotes(
    id: number,
    filters?: {
      note_id?: number;
      title?: string;
      tag?: string;
      dateFrom?: number;
      dateTo?: number;
    }
  ): any {
    let endpoint = this.url + '/therapist/notes?therapist_id=' + id;

    if (filters) {
      // Itera sulle chiavi dell'oggetto filters
      Object.keys(filters).forEach((key) => {
        // Castiamo key al tipo delle chiavi presenti in filters
        const value = filters[key as keyof typeof filters];
        // Controlla che il valore non sia undefined, null o una stringa vuota
        if (value !== undefined && value !== null && value !== '') {
          endpoint += `&${encodeURIComponent(key)}=${encodeURIComponent(
            value
          )}`;
        }
      });
    }
    return this.http.get(endpoint);
  }

  getPatientNotes(therapist_id: number, patient_id: number): any {
    return this.http.get(
      this.url +
        '/therapist/patient-notes?therapist_id=' +
        therapist_id +
        '&patient_id=' +
        patient_id
    );
  }

  getNotesAboutPatient(patient_id: number, therapist_id: number): any {
    return this.http.get(
      this.url +
        '/therapist/notes-about-patient?therapist_id=' +
        therapist_id +
        '&patient_id=' +
        patient_id
    );
  }

  getNotifications(id: number): any {
    return this.http.get(
      this.url + '/therapist/notifications?therapist_id=' + id
    );
  }

  postNote(body: {
    title: string;
    content: JSON;
    patient_id: number;
    therapist_id: number;
    tags: JSON;
  }): any {
    this.auth.checkCredentials();
    return this.http.post(this.url + '/therapist/notes', body);
  }

  postNotification(body: {
    content: string;
    patient_id: number;
    therapist_id: number;
  }): any {
    this.auth.checkCredentials();
    return this.http.post(this.url + '/therapist/notifications', body);
  }

  modifyNote(body: {
    title: string;
    content: JSON;
    therapist_id: number;
    tags?: JSON;
    note_id: number;
  }): any {
    this.auth.checkCredentials();
    return this.http.put(this.url + '/therapist/notes', body);
  }

  acceptPatient(body: { patient_id: number; therapist_id: number }) {
    this.auth.checkCredentials();
    return this.http.put(this.url + '/therapist/accept-patient', body);
  }

  dischargePatient(body: { patient_id: number; therapist_id: number }) {
    this.auth.checkCredentials();
    return this.http.put(this.url + '/therapist/discharge-patient', body);
  }

  deleteNote(note_id: number, therapist_id: number) {
    this.auth.checkCredentials();
    return this.http.delete(
      this.url +
        '/therapist/notes?therapist_id=' +
        therapist_id +
        '&note_id=' +
        note_id
    );
  }

  deleteNotification(notification_id: number, therapist_id: number) {
    this.auth.checkCredentials();
    return this.http.delete(
      this.url +
        '/therapist/notifications?notification_id=' +
        notification_id +
        '&therapist_id=' +
        therapist_id
    );
  }
}
