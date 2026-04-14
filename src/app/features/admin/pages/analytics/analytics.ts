import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  metricCards = [
    { label: 'Requests This Month', value: '26', note: 'Submitted leave requests currently visible in admin analytics.' },
    { label: 'Approved Requests', value: '18', note: 'Requests marked approved in the current month.' },
    { label: 'Rejected Requests', value: '05', note: 'Requests closed with rejected status.' },
    { label: 'Pending Requests', value: '03', note: 'Requests still open in the approval flow.' },
  ];

  departmentRows = [
    { name: 'Engineering', requests: 11, pending: 2, avgBalance: '11 days' },
    { name: 'People Ops', requests: 4, pending: 0, avgBalance: '16 days' },
    { name: 'Support', requests: 7, pending: 1, avgBalance: '9 days' },
    { name: 'Finance', requests: 4, pending: 0, avgBalance: '13 days' },
  ];

  balanceNotes = [
    'Department counts can later be connected to API-driven analytics.',
    'This page is a starter skeleton for request trends and leave balance summaries.',
    'Keep the logic simple here until live admin analytics services are ready.',
  ];
}
