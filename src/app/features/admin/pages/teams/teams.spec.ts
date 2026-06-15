import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TeamManagementPage } from './teams';
import { RowActionMenuComponent } from '../../../../shared/components/row-action-menu/row-action-menu';

describe('TeamManagementPage', () => {
  let component: TeamManagementPage;
  let fixture: ComponentFixture<TeamManagementPage>;

  const teams = [
    { id: 1, teamName: 'Alpha', managerName: 'Alice', employeeCount: 1 } as any,
    { id: 2, teamName: 'Beta', managerName: null, employeeCount: 0 } as any,
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TeamManagementPage,
        RowActionMenuComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamManagementPage);
    component = fixture.componentInstance;
    component.teams = [...teams];
    component.filteredTeams = [...teams];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose team action items', () => {
    expect(component.getTeamActions()).toEqual([
      { id: 'EDIT_TEAM', label: 'Edit team' },
      { id: 'ASSIGN_MANAGER', label: 'Assign manager' },
    ]);
  });

  it('should open and close the row menu by team id', () => {
    expect(component.activeRowMenuId()).toBeNull();
    component.onTeamMenuState(1, true);
    expect(component.activeRowMenuId()).toBe(1);
    component.onTeamMenuState(1, false);
    expect(component.activeRowMenuId()).toBeNull();
  });

  it('should route EDIT_TEAM action to edit dialog', () => {
    component.openEditDialog = jasmine.createSpy('openEditDialog');
    component.activeRowMenuId.set(2);
    component.onTeamMenuAction(teams[1], 'EDIT_TEAM');
    expect(component.openEditDialog).toHaveBeenCalledWith(teams[1]);
    expect(component.activeRowMenuId()).toBeNull();
  });

  it('should route ASSIGN_MANAGER action to assign dialog', () => {
    component.openAssignManagerDialog = jasmine.createSpy('openAssignManagerDialog');
    component.activeRowMenuId.set(2);
    component.onTeamMenuAction(teams[1], 'ASSIGN_MANAGER');
    expect(component.openAssignManagerDialog).toHaveBeenCalledWith(teams[1]);
    expect(component.activeRowMenuId()).toBeNull();
  });
});
