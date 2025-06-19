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

  public saveSessionUser(data: {
    id: string;
    name: string;
    surname: string;
    role: 'patient' | 'therapist';
    therapist_id: string;
  }): void {
    Object.entries(data).forEach(([key, value]) => {
      sessionStorage.setItem(key, value);
    });
  }

  public get sessionStorageUser(): UserData {
    const sessionUser: any = {};
    sessionUser.id = JSON.parse(sessionStorage.getItem('id')!);
    sessionUser.name = sessionStorage.getItem('name');
    sessionUser.surname = sessionStorage.getItem('surname');
    sessionUser.role = sessionStorage.getItem('role');
    if (sessionUser.role == 'patient') {
      sessionUser.therapist_id = JSON.parse(
        sessionStorage.getItem('therapist_id')!
      );
    } else {
      sessionUser.therapist_id = undefined;
    }

    return sessionUser;
  }
}
