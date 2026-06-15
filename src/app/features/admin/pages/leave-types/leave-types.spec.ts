import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveTypesPage } from './leave-types';

describe('LeaveTypesPage', () => {
  let component: LeaveTypesPage;
  let fixture: ComponentFixture<LeaveTypesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveTypesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
