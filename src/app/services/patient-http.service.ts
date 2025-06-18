import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class PatientHttpService {
  constructor(private http: HttpClient, private auth: AuthService) {}
  private url: string = 'http://localhost:3000';

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
    let endpoint = this.url + '/patient/notes?patient_id=' + id;

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

  getNotifications(id: number): any {
    return this.http.get(this.url + '/patient/notifications?patient_id=' + id);
  }

  postNote(body: {
    title: string;
    content: JSON;
    tags: JSON | null;
    patient_id: number;
  }): any {
    this.auth.checkCredentials();
    return this.http.post(this.url + '/patient/notes', body);
  }

  postNotification(body: { content: string; patient_id: number }): any {
    this.auth.checkCredentials();
    return this.http.post(this.url + '/patient/notifications', body);
  }

  selectTherapist(body: { patient_id: number; therapist_id: number }): any {
    this.auth.checkCredentials();
    return this.http.put(this.url + '/patient/therapist', body);
  }

  dischargeTherapist(body: { patient_id: number; therapist_id: number }): any {
    this.auth.checkCredentials();
    return this.http.put(this.url + '/patient/therapist-null', body);
  }

  modifyNote(body: {
    title: string;
    note_id: number;
    content: JSON;
    tags?: JSON | null;
    patient_id: number;
  }): any {
    this.auth.checkCredentials();
    return this.http.put(this.url + '/patient/notes', body);
  }

  changeNoteVisibility(body: {
    note_id: number;
    shared: number;
    patient_id: number;
  }): any {
    this.auth.checkCredentials();
    return this.http.put(this.url + '/patient/notes/visibility', body);
  }

  deleteNote(note_id: number, patient_id: number): any {
    this.auth.checkCredentials();
    return this.http.delete(
      this.url +
        '/patient/notes?patient_id=' +
        patient_id +
        '&note_id=' +
        note_id
    );
  }

  deleteNotification(notification_id: number): any {
    this.auth.checkCredentials();
    return this.http.delete(
      this.url + '/patient/notifications?notification_id=' + notification_id
    );
  }
}
