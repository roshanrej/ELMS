import { TestBed } from '@angular/core/testing';

import { LeavePolicyApi } from './leave-policy-api';

describe('LeavePolicyApi', () => {
  let service: LeavePolicyApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeavePolicyApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
