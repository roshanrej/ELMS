import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminTeamService } from '../../services/team/admin-team.service';
import { TeamDTO, TeamManagerOptionDTO } from '../../../../core/dtos/team/team.model';
import { RowActionMenuComponent } from '../../../../shared/components/row-action-menu/row-action-menu';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RowActionMenuComponent, PageHeader, LoadingSpinner],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class TeamManagementPage implements OnInit {
  private readonly adminTeamService = inject(AdminTeamService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  teams: TeamDTO[] = [];
  filteredTeams: TeamDTO[] = [];
  managers: TeamManagerOptionDTO[] = [];
  activeMenuRowId: number | null = null;
  selectedTeam: TeamDTO | null = null;
  isLoading = false;
  createDialogVisible = false;
  editDialogVisible = false;
  assignDialogVisible = false;
  teamSearch = '';
  managerSearch = '';

  readonly createTeamForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  readonly editTeamForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  readonly assignManagerForm = this.fb.group({
    managerId: this.fb.control<number | null>(null, Validators.required),
  });

  get selectedManagerId(): number | null {
    return this.assignManagerForm.controls.managerId.value;
  }

  get totalTeamCount(): number {
    return this.teams.length;
  }

  get unassignedTeamCount(): number {
    return this.teams.filter((team) => !team.managerName).length;
  }

  get assignedTeamCount(): number {
    return this.teams.filter((team) => !!team.managerName).length;
  }

  get availableManagers(): TeamManagerOptionDTO[] {
    const searchTerm = this.managerSearch.trim().toLowerCase();
    if (!searchTerm) return this.managers;
    return this.managers.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm) ||
        m.email.toLowerCase().includes(searchTerm),
    );
  }

  ngOnInit(): void {
    this.teams = this.route.snapshot.data['teams'] ?? [];
    this.filteredTeams = this.filterTeamList(this.teamSearch);
  }

  searchTeams(value: string): void {
    this.teamSearch = value;
    this.filteredTeams = this.filterTeamList(value);
  }

  openCreateDialog(): void {
    this.closeDialogs();
    this.createTeamForm.reset({ name: '' });
    this.createDialogVisible = true;
  }

  openEditDialog(team: TeamDTO): void {
    this.closeDialogs();
    this.selectedTeam = team;
    this.editTeamForm.reset({ name: team.teamName });
    this.editDialogVisible = true;
  }

  openAssignManagerDialog(team: TeamDTO): void {
    this.closeDialogs();
    this.selectedTeam = team;
    this.assignManagerForm.reset({ managerId: null });
    this.managerSearch = '';
    this.assignDialogVisible = true;
    this.loadManagers();
  }

  submitCreateTeam(): void {
    if (this.createTeamForm.invalid) {
      this.createTeamForm.markAllAsTouched();
      return;
    }

    const name = this.createTeamForm.value.name?.trim() ?? '';
    if (!name) {
      this.createTeamForm.controls.name.setErrors({ required: true });
      return;
    }

    this.adminTeamService.createTeam({ name }).subscribe({
      next: (team) => {
        this.teams = [team, ...this.teams];
        this.filteredTeams = this.filterTeamList(this.teamSearch);
        this.closeDialogs();
        this.notifications.showSuccess('Team created successfully.');
      },
    });
  }

  submitEditTeam(): void {
    if (!this.selectedTeam || this.editTeamForm.invalid) {
      this.editTeamForm.markAllAsTouched();
      return;
    }

    const name = this.editTeamForm.value.name?.trim() ?? '';
    if (!name) {
      this.editTeamForm.controls.name.setErrors({ required: true });
      return;
    }

    this.adminTeamService.editTeam(this.selectedTeam.id, { name }).subscribe({
      next: (updatedTeam) => {
        this.teams = this.teams.map((t) =>
          t.id === updatedTeam.id ? updatedTeam : t,
        );
        this.filteredTeams = this.filterTeamList(this.teamSearch);
        this.closeDialogs();
        this.notifications.showSuccess('Team updated successfully.');
      },
    });
  }

  submitAssignManager(): void {
    if (!this.selectedTeam || this.assignManagerForm.invalid) {
      this.assignManagerForm.markAllAsTouched();
      return;
    }

    const managerId = this.assignManagerForm.value.managerId as number | null;
    if (managerId === null) return;

    this.adminTeamService.assignTeamManager(this.selectedTeam.id, managerId).subscribe({
      next: (updatedTeam) => {
        this.teams = this.teams.map((t) =>
          t.id === updatedTeam.id ? updatedTeam : t,
        );
        this.filteredTeams = this.filterTeamList(this.teamSearch);
        this.closeDialogs();
        this.notifications.showSuccess('Manager assigned successfully.');
      },
    });
  }

  isRowMenuOpen(teamId: number): boolean {
    return this.activeMenuRowId === teamId;
  }

  onMenuToggle(teamId: number, isOpen: boolean): void {
    if (isOpen) {
      this.activeMenuRowId = teamId;
      return;
    }

    if (this.activeMenuRowId === teamId) {
      this.activeMenuRowId = null;
    }
  }

  isMenuCloseRequested(teamId: number): boolean {
    return this.activeMenuRowId !== null && this.activeMenuRowId !== teamId;
  }

  closeDialogs(): void {
    this.createDialogVisible = false;
    this.editDialogVisible = false;
    this.assignDialogVisible = false;
    this.activeMenuRowId = null;
    this.selectedTeam = null;
  }

  getTeamActions(): readonly { id: string; label: string }[] {
    return [
      { id: 'edit', label: 'Edit team' },
      { id: 'assign', label: 'Assign manager' },
    ];
  }

  onTeamMenuState(teamId: number, isOpen: boolean): void {
    this.onMenuToggle(teamId, isOpen);
  }

  onTeamMenuAction(team: TeamDTO, actionId: string): void {
    if (actionId === 'edit') {
      this.openEditDialog(team);
    } else if (actionId === 'assign') {
      this.openAssignManagerDialog(team);
    }
  }

  private loadManagers(): void {
    this.adminTeamService.loadAvailableManagers().subscribe({
      next: (managers) => {
        this.managers = managers;
      },
    });
  }

  private filterTeamList(query: string): TeamDTO[] {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return [...this.teams];
    return this.teams.filter(
      (team) =>
        team.teamName.toLowerCase().includes(searchTerm) ||
        (team.managerName ?? 'unassigned').toLowerCase().includes(searchTerm),
    );
  }
}
