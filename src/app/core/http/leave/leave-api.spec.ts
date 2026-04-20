import { TestBed } from '@angular/core/testing';

import { LeaveApi } from './leave-api';

describe('LeaveApi', () => {
  let service: LeaveApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
