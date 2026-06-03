import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeDashboardPage } from './dashboard';
import { LeaveService } from '../../services/leave-requests/leave.service';

describe('EmployeeDashboardPage', () => {
  let component: EmployeeDashboardPage;
  let fixture: ComponentFixture<EmployeeDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDashboardPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                leaves: [],
              },
            },
          },
        },
        {
          provide: LeaveService,
          useValue: {
            getEmployeeLeaves: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
