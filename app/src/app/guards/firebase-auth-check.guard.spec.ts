import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { firebaseAuthCheckGuard } from './firebase-auth-check.guard';

describe('firebaseAuthCheckGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => firebaseAuthCheckGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
