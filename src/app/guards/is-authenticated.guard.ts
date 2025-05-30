import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authservice = inject(AuthService);
  const role = sessionStorage.getItem('role');
  const id = sessionStorage.getItem('id');
  const name = sessionStorage.getItem('name');
  const surname = sessionStorage.getItem('surname');
  if (!role || !id || !name || !surname) {
    alert('Could not recover the session. You will be reinderized at login.');
    authservice.logout();
    return false;
  }
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
};
