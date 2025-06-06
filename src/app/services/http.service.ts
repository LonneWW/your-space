import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}
  private url: string = 'http://localhost:3000';

  getPatient(id: Number): any {
    return this.http.get(this.url + '/patient/' + id);
  }

  getTherapist(id: Number): any {
    return this.http.get(this.url + '/therapist/' + id);
  }

  getAllTherapists(): any {
    return this.http.get(this.url + '/patient/therapists');
  }
}
