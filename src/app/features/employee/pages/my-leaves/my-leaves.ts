import { Component, inject, signal } from '@angular/core';
import { LeaveService } from '../../../../core/services/leave/leave.service';
import { LeaveModel} from '../../../../core/models/leave/leave-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LeaveTypeModel } from '../../../../core/models/leave/leave-type.model';
import { LeaveActionType } from '../../../../core/types-enums/leave-action.enum';
type LeaveRowView = LeaveModel & {
  formattedRange: string;
  availableActions: string[];
};

/**
 * ARCHITECTURAL NOTE:
 * This component displays leave data. Business logic (filtering by status, determining available actions)
 * is owned by the backend. The backend should:
 * - Pre-filter leaves based on mode (draft vs submitted)
 * - Return available actions per leave in API response
 * - Provide status styling/metadata in API response
 */
@Component({
  selector: 'app-my-leaves',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.scss',
})
export class MyLeavesPage {

  mode : string = ''
  selectedType : string | 'ALL' = 'ALL';
  selectedStatus: string | 'ALL' = 'ALL';
  private route : ActivatedRoute = inject(ActivatedRoute)
  years: number[] = [];
  selectedYear: number | 'ALL' = 'ALL';
  employeeLeaves: LeaveModel[] = [] //leaves fetched from API
  leaveTypes: LeaveTypeModel[] = [];
  isLoading = signal(true);
  filteredLeaves: LeaveRowView[] = [];
  
  applyFilters() {
  let filtered = this.employeeLeaves;
 
  // 🔹 Year filter (UI-only filtering - display concern)
  if (this.selectedYear !== 'ALL') {
    filtered = filtered.filter(leave =>
      new Date(leave.startDate).getFullYear() === this.selectedYear
    );
  }

  // 🔹 Status filter (UI-only filtering - display concern)
  if (this.selectedStatus !== 'ALL') {
    filtered = filtered.filter(leave =>
      leave.status === this.selectedStatus
    );
  }

  // 🔹 Type filter
  if (this.selectedType !== 'ALL') {
    filtered = filtered.filter(leave =>
      leave.leaveType === this.selectedType
    );
  }

  this.filteredLeaves = filtered.map(leave => ({
    ...leave,
    formattedRange: this.formatDateRange(leave.startDate, leave.endDate),
    availableActions: [], // TODO: Backend should provide available actions per leave
  }));
}

  extractYears() {
    const yearSet = new Set<number>();
    this.employeeLeaves.forEach(leave => {
      const year = new Date(leave.startDate).getFullYear();
      yearSet.add(year);
    });
    this.years = Array.from(yearSet).sort((a, b) => b - a); // latest first
  }

ngOnInit() {
  this.mode = this.route.snapshot.data['mode'];
  this.leaveTypes = this.route.snapshot.data['leaveTypes'] ?? [];
  
  // Backend should return pre-filtered leaves based on mode
  // (draft leaves only, or submitted leaves only)
  const leaves : LeaveModel[] = this.route.snapshot.data['leaves'] ?? [];
  this.employeeLeaves = leaves;
  
  this.extractYears();
  this.applyFilters();
  this.isLoading.set(false);
}

  /**
   * Display-only formatting. Do NOT use for business calculations.
   */
  formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  }

  /**
   * Status styling should come from backend.
   * For now, provide basic mapping for rendering.
   */
  statusClassMap: Record<string, string> = {
    APPROVED: 'badge-soft-green',
    PENDING: 'badge-soft-yellow',
    REJECTED: 'badge-soft-red',
    CANCELLED: 'badge-soft-gray',
    DRAFT: 'badge-soft-gray',
    CANCEL_REQUESTED: 'badge-soft-orange'
  };

  /**
   * TODO: Remove this mapping when backend provides status labels.
   */
  statusLabelMap: Record<string, string> = {
    APPROVED: 'Approved',
    PENDING: 'Pending',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
    DRAFT: 'Draft',
    CANCEL_REQUESTED: 'Cancellation Requested'
  };

  getTypeLabel(type: string | null | undefined): string {
    if (!type) return '-';
    const resolvedType = this.leaveTypes.find(item => item.name === type);
    return this.formatType(resolvedType?.name ?? type);
  }

  formatType(type: string): string {
    return type
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  /**
   * Available actions should come from backend in the leave object.
   * Backend knows which actions are valid based on:
   * - Current status
   * - User permissions
   * - Business rules
   * 
   * This is a placeholder that will be replaced by backend data.
   */
} 
