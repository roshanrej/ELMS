import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LeaveStatusBadge } from '../../../../shared/components/leave-status-badge/leave-status-badge';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { UserProjectionDTO } from '../../../../core/dtos/user/user-projection.dto';
import { UserStatusEnum } from '../../../../core/types-enums/user-status.enum';

interface EmployeeStat {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-employees',
  imports: [CommonModule, PageHeader, LeaveStatusBadge, LoadingSpinner],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class EmployeesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  employees: UserProjectionDTO[] = [];
  employeeStats: EmployeeStat[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.employees = this.route.snapshot.data['employees'] ?? [];
    this.buildStats();
    this.isLoading = false;
  }

  formatLabel(value: string): string {
    return value
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private buildStats(): void {
    const activeCount = this.employees.filter((e) => e.status === UserStatusEnum.ACTIVE).length;
    const managerCount = this.employees.filter((e) => e.role === 'MANAGER').length;
    const employeeCount = this.employees.filter((e) => e.role === 'EMPLOYEE').length;

    this.employeeStats = [
      {
        label: 'Total Users',
        value: String(this.employees.length),
        note: 'All registered accounts in the system.',
      },
      {
        label: 'Active Users',
        value: String(activeCount),
        note: 'Users currently allowed to sign in.',
      },
      {
        label: 'Managers',
        value: String(managerCount),
        note: 'Users who can approve team leave requests.',
      },
      {
        label: 'Employees',
        value: String(employeeCount),
        note: 'Individual contributors requesting leave.',
      },
    ];
  }
}