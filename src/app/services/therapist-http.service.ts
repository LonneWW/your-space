import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TherapistHttpService {
  constructor(private http: HttpClient) {}
  private url: string = 'http://localhost:3000';

  getPatients(therapist_id: Number) {
    return this.http.get(
      this.url + '/therapist/patients?therapist_id=' + therapist_id
    );
  }

  getPatientNotes(therapist_id: Number, patient_id: Number): any {
    return this.http.get(
      this.url +
        '/therapist/patient-notes?therapist_id=' +
        therapist_id +
        '&patient_id=' +
        patient_id
    );
  }

  getNotesAboutPatient(patient_id: Number, therapist_id: Number): any {
    return this.http.get(
      this.url +
        '/therapist/notes-about-patient?therapist_id=' +
        therapist_id +
        '&patient_id=' +
        patient_id
    );
  }

  getNotifications(id: Number): any {
    return this.http.get(
      this.url + '/therapist/notifications?therapist_id=' + id
    );
  }

  postNote(body: {
    content: JSON;
    patient_id: Number;
    therapist_id: Number;
    tags: JSON;
  }): any {
    return this.http.post(this.url + '/therapist/notes', body);
  }

  postNotification(body: {
    content: string;
    patient_id: Number;
    therapist_id: Number;
  }): any {
    return this.http.post(this.url + '/therapist/notifications', body);
  }

  modifyNote(body: {
    content: JSON;
    therapist_id: Number;
    tags: JSON;
    note_id: Number;
  }): any {
    return this.http.put(this.url + '/therapist/notes', body);
  }

  acceptPatient(body: { patient_id: Number; therapist_id: Number }) {
    return this.http.put(this.url + '/therapist/patient', body);
  }

  deleteNote(note_id: Number, therapist_id: Number) {
    return this.http.delete(
      this.url +
        '/therapist/notes?therapist_id=' +
        therapist_id +
        '&note_id=' +
        note_id
    );
  }

  deleteNotification(notification_id: Number) {
    return this.http.delete(
      this.url + '/therapist/notifications?notification_id=' + notification_id
    );
  }
}
