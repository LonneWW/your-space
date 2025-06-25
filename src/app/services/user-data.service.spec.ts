import { TestBed } from '@angular/core/testing';
import { UserDataService } from './user-data.service';
import { UserData } from '../interfaces/IUserData';

describe('UserDataService', () => {
  let service: UserDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDataService],
    });
    service = TestBed.inject(UserDataService);
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateUserData', () => {
    it('should update user data when no previous data exists', () => {
      const userData: UserData = {
        id: 1,
        name: 'Mario',
        surname: 'Rossi',
        role: 'patient',
        therapist_id: 2,
      };

      service.updateUserData(userData);
      expect(service.currentUserData).toEqual(userData);
    });

    it('should merge new data with existing user data', () => {
      const initialData: UserData = {
        id: 1,
        name: 'Mario',
        surname: 'Rossi',
        role: 'patient',
        therapist_id: 2,
      };
      service.updateUserData(initialData);

      // Aggiorniamo solo il nome (gli altri campi rimangono invariati)
      const updatedData: UserData = {
        id: 1,
        name: 'Luigi',
        surname: 'Rossi',
        role: 'patient',
        therapist_id: 2,
      };
      service.updateUserData(updatedData);
      expect(service.currentUserData).toEqual(updatedData);
    });
  });

  describe('saveSessionUser and sessionStorageUser', () => {
    it('should properly save and retrieve session user for a therapist', () => {
      // Nel caso di un terapeuta, il metodo sessionStorageUser imposta therapist_id a undefined.
      const sessionUserData = {
        id: '3',
        name: 'Anna',
        surname: 'Verdi',
        role: 'therapist' as 'therapist',
        therapist_id: '0',
      };

      service.saveSessionUser(sessionUserData);
      const retrievedUser = service.sessionStorageUser;
      expect(retrievedUser.id).toEqual(3);
      expect(retrievedUser.name).toEqual('Anna');
      expect(retrievedUser.surname).toEqual('Verdi');
      expect(retrievedUser.role).toEqual('therapist');
      // Per un ruolo 'therapist', il service imposta therapist_id a undefined.
      expect(retrievedUser.therapist_id).toBeUndefined();
    });

    it('should properly save and retrieve session user for a patient', () => {
      const sessionUserData = {
        id: '4',
        name: 'Giorgio',
        surname: 'Bianchi',
        role: 'patient' as 'patient',
        therapist_id: '7',
      };

      service.saveSessionUser(sessionUserData);
      const retrievedUser = service.sessionStorageUser;
      expect(retrievedUser.id).toEqual(4);
      expect(retrievedUser.name).toEqual('Giorgio');
      expect(retrievedUser.surname).toEqual('Bianchi');
      expect(retrievedUser.role).toEqual('patient');
      // Poiché il dato viene salvato come stringa '7' e poi parsato tramite JSON.parse,
      // ci aspettiamo di ottenere il numero 7.
      expect(retrievedUser.therapist_id).toEqual(7);
    });
  });

  describe('userData$ observable', () => {
    it('should emit new user data when updated', (done) => {
      const testUserData: UserData = {
        id: 5,
        name: 'Carla',
        surname: 'Neri',
        role: 'therapist',
        // Per un terapeuta, il valore passato qui non interveniene nel merge e il service
        // potrebbe gestirlo diversamente, ma tipicamente, quando usato tramite updateUserData,
        // il BehaviorSubject emette esattamente l'oggetto passato.
        therapist_id: null,
      };

      service.userData$.subscribe((data) => {
        if (data) {
          expect(data).toEqual(testUserData);
          done();
        }
      });
      service.updateUserData(testUserData);
    });
  });
});
