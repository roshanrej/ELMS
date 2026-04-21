import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { LeaveApi } from './leave-api';

describe('LeaveApi', () => {
  let service: LeaveApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(LeaveApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
