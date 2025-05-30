import { TestBed } from '@angular/core/testing';

import { TherapistHttpService } from './therapist-http.service';

describe('TherapistHttpService', () => {
  let service: TherapistHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TherapistHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
