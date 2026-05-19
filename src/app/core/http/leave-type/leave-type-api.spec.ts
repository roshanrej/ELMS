import { TestBed } from '@angular/core/testing';

import { LeaveTypeApi } from './leave-type-api';

describe('LeaveTypeApi', () => {
  let service: LeaveTypeApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveTypeApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
