import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { LeaveBalancePage } from './leave-balance';

describe('LeaveBalancePage', () => {
  let component: LeaveBalancePage;
  let fixture: ComponentFixture<LeaveBalancePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveBalancePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { leaveBalances: [] } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveBalancePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
