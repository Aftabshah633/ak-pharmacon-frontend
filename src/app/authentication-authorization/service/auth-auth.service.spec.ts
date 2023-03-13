import { TestBed } from '@angular/core/testing';

import { AuthAuthService } from './auth-auth.service';

describe('AuthAuthService', () => {
  let service: AuthAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
