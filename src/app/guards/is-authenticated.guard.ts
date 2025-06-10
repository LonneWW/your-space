import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authservice = inject(AuthService);
  const userDataService = inject(UserDataService);
  const sessionUserData = userDataService.sessionStorageUser;
  console.log(sessionUserData);
  if (
    sessionUserData &&
    sessionUserData.role &&
    sessionUserData.id &&
    sessionUserData.name &&
    sessionUserData.surname
  ) {
    return authservice.isLoggedIn().pipe(
      map((r) => {
        console.log(r);
        return true;
      }),
      catchError((error) => {
        console.log(error);
        alert(error.message);
        authservice.logout();
        return of(false);
      })
    );
  }
  alert('Could not recover the session. You will be reinderized at login.');
  authservice.logout();
  return false;
};
