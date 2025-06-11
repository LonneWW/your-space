import { TestBed } from '@angular/core/testing';

import { CredentialsMatchService } from './credentials-match.service';

describe('CredentialsMatchService', () => {
  let service: CredentialsMatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialsMatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
