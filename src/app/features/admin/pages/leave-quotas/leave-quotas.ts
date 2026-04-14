import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-leave-quotas',
  imports: [CommonModule],
  templateUrl: './leave-quotas.html',
  styleUrl: './leave-quotas.scss',
})
export class LeaveQuotas {
  policyCards = signal([
    { label: 'Annual Leave', days: '18', note: 'Standard yearly allocation for full-time employees.' },
    { label: 'Sick Leave', days: '10', note: 'Used for unplanned medical leave and recovery.' },
    { label: 'Casual Leave', days: '06', note: 'Short planned leave for personal needs and errands.' },
  ]) ; // leave policy 

  quotaRows = [
    { group: 'Engineering', annual: '18', sick: '10', casual: '06', status: 'Aligned' },
    { group: 'People Ops', annual: '18', sick: '10', casual: '06', status: 'Aligned' },
    { group: 'Support Shift Team', annual: '15', sick: '10', casual: '05', status: 'Review' },
  ]; 
}
