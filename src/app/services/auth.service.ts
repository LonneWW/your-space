import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private url: string = 'http://localhost:3000';

  registerUser(body: {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
  }) {
    return this.http.post(this.url + '/auth/register/' + body.role, body);
  }

  loginUser(body: {
    email: string;
    password: string;
    role: string;
  }): Observable<{
    id: number;
    name: string;
    surname: string;
    therapist_id: number;
  }> {
    return this.http.post<{
      id: number;
      name: string;
      surname: string;
      therapist_id: number;
    }>(this.url + '/auth/login/' + body.role, body);
  }

  isLoggedIn() {
    const id = sessionStorage.getItem('id');
    const name = sessionStorage.getItem('name');
    const role = sessionStorage.getItem('role');
    const surname = sessionStorage.getItem('surname');
    return this.http.get(
      this.url +
        '/auth?' +
        `id=${id}&name=${name}&surname=${surname}&role=${role}`
    );
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
