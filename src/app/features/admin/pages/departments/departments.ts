import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { DepartmentProjectionDTO } from '../../../../core/dtos/department/department.projection.dto';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, PageHeader, LoadingSpinner],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class DepartmentsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  departments: DepartmentProjectionDTO[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.departments = this.route.snapshot.data['departments'] ?? [];
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
}