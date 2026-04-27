import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { LeaveBalance } from './leave-balance';

describe('LeaveBalance', () => {
  let component: LeaveBalance;
  let fixture: ComponentFixture<LeaveBalance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveBalance],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { leaveBalances: [] } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveBalance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
