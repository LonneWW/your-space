import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../interfaces/IUserData';
@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor() {}
  private _userDataSubject: BehaviorSubject<UserData | null> =
    new BehaviorSubject<UserData | null>(null);

  public get userData$(): Observable<UserData | null> {
    return this._userDataSubject.asObservable();
  }

  public get currentUserData(): UserData | null {
    return this._userDataSubject.getValue();
  }

  public updateUserData(newData: UserData): void {
    const currentData = this._userDataSubject.getValue();
    const updatedData = currentData ? { ...currentData, ...newData } : newData;
    this._userDataSubject.next(updatedData as UserData);
  }

  public saveSessionUser(data: UserData): void {
    Object.entries(data).forEach(([key, value]) => {
      sessionStorage.setItem(key, value);
    });
  }

  public get sessionStorageUser(): UserData {
    const sessionUser: any = {};
    sessionUser.id = sessionStorage.getItem('id');
    sessionUser.name = sessionStorage.getItem('name');
    sessionUser.surname = sessionStorage.getItem('surname');
    sessionUser.role = sessionStorage.getItem('role');
    let therapist_id = sessionStorage.getItem('therapist_id');
    if (therapist_id) {
      sessionUser.therapist_id = therapist_id;
    }
    return sessionUser;
  }
}
