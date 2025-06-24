import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userDataService = inject(UserDataService);
  const sessionUserData = userDataService.sessionStorageUser;
  const serviceUserData = userDataService.currentUserData;
  if (serviceUserData?.role == sessionUserData.role) {
    return true;
  }
  authService.logout();
  return false;
};
