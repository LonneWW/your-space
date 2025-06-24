import { CanDeactivateFn } from '@angular/router';

export const confirmChangePageGuard: CanDeactivateFn<unknown> = () => {
  return confirm('Are you sure you want to leave this page?');
};
