import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeavesPage } from './team-leaves';

describe('TeamLeavesPage', () => {
  let component: TeamLeavesPage;
  let fixture: ComponentFixture<TeamLeavesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeavesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamLeavesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
