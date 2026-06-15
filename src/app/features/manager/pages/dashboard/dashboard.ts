import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { ManagerDashboardProjectionDTO } from '../../../../core/dtos/dashboard/manager-dashboard-projection.dto';
import { ManagerDashboardLeaveProjectionDTO } from '../../../../core/dtos/leave-request/manager-dashboard-leave-projection.dto';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, PageHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class ManagerDashboardPage implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  
 
  upcomingLeaves : ManagerDashboardLeaveProjectionDTO [] = [];
  pendingCount: number = 0 ;
  pendingCancelCount : number = 0;
ngOnInit(): void {
  const managerDashboardDetails: ManagerDashboardProjectionDTO =
    this.route.snapshot.data['managerDashboardDetails'];

  this.upcomingLeaves = managerDashboardDetails?.upcomingLeaves;
  this.pendingCount = managerDashboardDetails?.pendingCount;
  this.pendingCancelCount = managerDashboardDetails?.pendingCancelCount;
}
  

  getTypeLabel(type: string | null | undefined): string {
    if (!type) return '-';
    return type
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
  
}
