import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserDataService } from './user-data.service';
import { CredentialsMatchService } from './credentials-match.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userData: UserDataService,
    private credentialsMatch: CredentialsMatchService
  ) {}
  private url: string = environment.apiUrl;

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
    return this.http.get(this.url + '/auth/verify-session');
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  checkCredentials(): void {
    const sessionUserTString = this.userData.sessionStorageUser;
    const serviceUserTString = this.userData.currentUserData;
    const sessionUser = this.credentialsMatch.normalizeUser(sessionUserTString);
    const serviceUser = this.credentialsMatch.normalizeUser(serviceUserTString);
    console.log(sessionUser);
    console.log(serviceUser);
    const check = this.credentialsMatch.deepEqual(sessionUser, serviceUser);
    if (!check) {
      alert(
        'Error with session credentials. You will be reinderized at login.'
      );
      this.logout();
    }
  }
}
