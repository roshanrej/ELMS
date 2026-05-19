import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveQuotasPage } from './leave-quotas';

describe('LeaveQuotasPage', () => {
  let component: LeaveQuotasPage;
  let fixture: ComponentFixture<LeaveQuotasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveQuotasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveQuotasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
