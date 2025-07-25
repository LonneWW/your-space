import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private auth: AuthService) {}
  private url: string = environment.apiUrl;

  getPatient(id: Number): any {
    return this.http.get(this.url + '/patient/' + id);
  }

  getTherapist(id: Number): any {
    return this.http.get(this.url + '/therapist/' + id);
  }

  getAllTherapists(patient_id: number): any {
    return this.http.get(
      this.url + '/patient/therapists?patient_id=' + patient_id
    );
  }
}
