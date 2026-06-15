import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { LeavePolicyProjectionDTO } from '../../../../core/dtos/leave-policy/leave-policy.projection.dto';
import { LeaveStatusBadge } from '../../../../shared/components/leave-status-badge/leave-status-badge';

@Component({
  selector: 'app-leave-quotas',
  imports: [CommonModule, PageHeader, LoadingSpinner, LeaveStatusBadge],
  templateUrl: './leave-quotas.html',
  styleUrl: './leave-quotas.scss',
})
export class LeaveQuotasPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  policies: LeavePolicyProjectionDTO[] = [];
  policyYear = new Date().getFullYear();
  isLoading = true;

  ngOnInit(): void {
    this.policies = this.route.snapshot.data['leavePolicies'] ?? [];
    this.isLoading = false;
  }

  formatType(type: string): string {
    return type
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}