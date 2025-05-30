import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PatientHttpService {
  constructor(private http: HttpClient) {}
  private url: string = 'http://localhost:3000';

  getNotes(id: Number): any {
    return this.http.get(this.url + '/patient/notes?patient_id=' + id);
  }

  getNotifications(id: Number): any {
    return this.http.get(this.url + '/patient/notifications?patient_id=' + id);
  }

  postNote(body: {
    content: JSON;
    tags: JSON;
    patient_id: Number;
    shared: Number;
  }): any {
    return this.http.post(this.url + '/patient/notes', body);
  }

  postNotification(body: { content: string; patient_id: Number }): any {
    return this.http.post(this.url + '/patient/notifications', body);
  }

  selectTherapist(body: { patient_id: Number; therapist_id: Number }): any {
    return this.http.put(this.url + '/patient/therapist', body);
  }

  dischargeTherapist(body: { patient_id: Number; therapist_id: Number }): any {
    return this.http.put(this.url + '/patient/therapist-null', body);
  }

  modifyNote(body: {
    note_id: Number;
    content: JSON;
    tags: JSON;
    patient_id: Number;
  }): any {
    return this.http.put(this.url + '/patient/notes', body);
  }

  changeNoteVisibility(body: {
    note_id: Number;
    shared: Number;
    patient_id: Number;
  }): any {
    return this.http.put(this.url + '/patient/notes/visibility', body);
  }

  deleteNote(note_id: Number, patient_id: Number): any {
    return this.http.delete(
      this.url +
        '/patient/notes?patient_id=' +
        patient_id +
        '&note_id=' +
        note_id
    );
  }

  deleteNotification(notification_id: Number): any {
    return this.http.delete(
      this.url + '/patient/notifications?notification_id=' + notification_id
    );
  }
}
