import { TestBed } from '@angular/core/testing';

import { PatientHttpService } from './patient-http.service';

describe('PatientHttpService', () => {
  let service: PatientHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
