import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MyLeavesPage } from './my-leaves';
import { LeaveService } from '../../services/leave-requests/leave.service';

describe('MyLeavesPage', () => {
  let component: MyLeavesPage;
  let fixture: ComponentFixture<MyLeavesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLeavesPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { mode: '' } } },
        },
        {
          provide: LeaveService,
          useValue: {
            getEmployeeLeaves: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyLeavesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
