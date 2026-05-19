import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDashboardPage } from './dashboard';

describe('ManagerDashboardPage', () => {
  let component: ManagerDashboardPage;
  let fixture: ComponentFixture<ManagerDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDashboardPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerDashboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
