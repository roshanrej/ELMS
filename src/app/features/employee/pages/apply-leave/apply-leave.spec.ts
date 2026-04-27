import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ApplyLeave } from './apply-leave';

describe('ApplyLeave', () => {
  let component: ApplyLeave;
  let fixture: ComponentFixture<ApplyLeave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyLeave],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { leaves: [] } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyLeave);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
