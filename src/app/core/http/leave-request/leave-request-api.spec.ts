import { TestBed } from '@angular/core/testing';

import { LeaveRequestApi } from './leave-request-api';

describe('LeaveRequestApi', () => {
  let service: LeaveRequestApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveRequestApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
