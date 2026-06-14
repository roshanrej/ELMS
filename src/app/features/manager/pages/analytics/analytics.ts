import { Component, OnInit } from '@angular/core';
import { LeaveBalanceProjectionDTO } from '../../../../core/dtos/leave-balance/leave-balance.projection.dto';

type TeamLeaveBalanceView = LeaveBalanceProjectionDTO & {
  remainingPercent: number;
  severityClass: string;
  progressClass: string;
};
@Component({
  selector: 'app-analytics',
  imports: [],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class ManagerAnalyticsPage implements OnInit {
  teamBalances: LeaveBalanceProjectionDTO[] = [];
  teamBalanceViews: TeamLeaveBalanceView[] = [];

  teamApprovalRate : number = 0
  avgTeamRemainingDays : number = 0
  teamPeakLeaveApplicationMonth : string = ""

  ngOnInit(): void {
    
  }
}
