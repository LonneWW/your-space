import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userDataService = inject(UserDataService);
  const sessionUserData = userDataService.sessionStorageUser;

  function logout() {
    alert('Could not recover the session. You will be reinderized at login.');
    authService.logout();
    return false;
  }

  if (
    sessionUserData &&
    sessionUserData.role &&
    sessionUserData.id &&
    sessionUserData.name &&
    sessionUserData.surname
  ) {
    const sessionTherapistId = sessionStorage.getItem('therapist_id');
    if (sessionUserData.role == 'patient' && !sessionTherapistId) {
      const serviceData = userDataService.currentUserData;
      if (serviceData?.therapist_id) {
        sessionUserData.therapist_id = serviceData.therapist_id;
      } else {
        return logout();
      }
    }
    return authService.isLoggedIn().pipe(
      map((r) => {
        return true;
      }),
      catchError((error) => {
        console.error(error);
        alert(error.message);
        authService.logout();
        return of(false);
      })
    );
  }
  return logout();
};
