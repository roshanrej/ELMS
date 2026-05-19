import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface MetricCard {
  label: string;
  value: string;
  note: string;
}

interface DepartmentAnalytics {
  name: string;
  requests: number;
  pending: number;
  avgBalance: string;
}

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class AdminAnalyticsPage {
  metricCards: MetricCard[] = [];
  departmentRows: DepartmentAnalytics[] = [];
  balanceNotes: string[] = [];
}
