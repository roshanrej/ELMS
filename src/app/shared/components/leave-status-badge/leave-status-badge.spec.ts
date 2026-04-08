import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveStatusBadge } from './leave-status-badge';

describe('LeaveStatusBadge', () => {
  let component: LeaveStatusBadge;
  let fixture: ComponentFixture<LeaveStatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveStatusBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveStatusBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
