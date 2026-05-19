import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerApprovalsPage } from './approvals';

describe('ManagerApprovalsPage', () => {
  let component: ManagerApprovalsPage;
  let fixture: ComponentFixture<ManagerApprovalsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerApprovalsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerApprovalsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
