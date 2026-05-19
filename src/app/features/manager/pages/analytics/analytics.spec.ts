import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerAnalyticsPage } from './analytics';

describe('ManagerAnalyticsPage', () => {
  let component: ManagerAnalyticsPage;
  let fixture: ComponentFixture<ManagerAnalyticsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerAnalyticsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerAnalyticsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
