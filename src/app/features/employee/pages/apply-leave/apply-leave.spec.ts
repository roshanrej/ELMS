import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ApplyLeavePage } from './apply-leave';

describe('ApplyLeavePage', () => {
  let component: ApplyLeavePage;
  let fixture: ComponentFixture<ApplyLeavePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyLeavePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { leaves: [] } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyLeavePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
