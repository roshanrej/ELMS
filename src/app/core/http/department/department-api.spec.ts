import { TestBed } from '@angular/core/testing';

import { DepartmentApi } from './department-api';

describe('DepartmentApi', () => {
  let service: DepartmentApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
