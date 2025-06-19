import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';
import { UserData } from '../interfaces/IUserData';

@Injectable({
  providedIn: 'root',
})
export class CredentialsMatchService {
  normalizeUser(sessionObj: any): UserData {
    let obj: UserData = {
      id: Number(sessionObj.id),
      name: sessionObj.name,
      role: sessionObj.role,
      surname: sessionObj.surname,
      therapist_id: null,
    };

    if (sessionObj.role == 'patient') {
      obj.therapist_id =
        sessionObj.therapist_id !== null
          ? Number(sessionObj.therapist_id)
          : null;
    }
    return obj;
  }
  deepEqual(obj1: any, obj2: any): boolean {
    // Controlla se sono strettamente uguali
    if (obj1 === obj2) return true;

    // Se uno dei due è null o non è oggetto
    if (
      typeof obj1 !== 'object' ||
      obj1 === null ||
      typeof obj2 !== 'object' ||
      obj2 === null
    ) {
      return false;
    }

    // Ottieni le chiavi di entrambi gli oggetti
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Controlla se il numero di chiavi è diverso
    if (keys1.length !== keys2.length) return false;

    // Per ogni chiave verifica che:
    // - L'altra proprietà esista.
    // - I valori associati siano deepEqual.
    for (const key of keys1) {
      if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }
}
