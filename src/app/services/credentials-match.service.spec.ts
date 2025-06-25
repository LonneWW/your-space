import { CredentialsMatchService } from './credentials-match.service';

describe('CredentialsMatchService', () => {
  let service: CredentialsMatchService;

  beforeEach(() => {
    service = new CredentialsMatchService();
  });

  it('should normalize a patient user correctly', () => {
    const input = {
      id: '5',
      name: 'Luigi',
      surname: 'Verdi',
      role: 'patient',
      therapist_id: '2',
    };
    const normalized = service.normalizeUser(input);
    expect(normalized).toEqual({
      id: 5,
      name: 'Luigi',
      surname: 'Verdi',
      role: 'patient',
      therapist_id: 2,
    });
  });

  it('should compare two objects deeply and return true', () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 2 } };
    expect(service.deepEqual(obj1, obj2)).toBeTrue();
  });

  it('should compare two objects deeply and return false when different', () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 3 } };
    expect(service.deepEqual(obj1, obj2)).toBeFalse();
  });
});
