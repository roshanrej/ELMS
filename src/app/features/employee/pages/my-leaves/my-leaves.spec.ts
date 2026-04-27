import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MyLeaves } from './my-leaves';
import { LeaveService } from '../../../../core/services/leave/leave';

describe('MyLeaves', () => {
  let component: MyLeaves;
  let fixture: ComponentFixture<MyLeaves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLeaves],
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

    fixture = TestBed.createComponent(MyLeaves);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
