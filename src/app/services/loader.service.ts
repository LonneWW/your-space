import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _count = 0;
  public loading$ = new BehaviorSubject<boolean>(false);

  show() {
    if (++this._count === 1) {
      this.loading$.next(true);
    }
  }

  hide() {
    if (--this._count === 0) {
      this.loading$.next(false);
    }
  }
}
