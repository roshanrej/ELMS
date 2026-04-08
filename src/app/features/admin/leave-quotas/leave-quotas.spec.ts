import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveQuotas } from './leave-quotas';

describe('LeaveQuotas', () => {
  let component: LeaveQuotas;
  let fixture: ComponentFixture<LeaveQuotas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveQuotas],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveQuotas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
