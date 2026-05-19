import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface DepartmentInfo {
  name: string;
  head: string;
  members: number;
  status: string;
  note: string;
}

@Component({
  selector: 'app-departments',
  imports: [CommonModule],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class DepartmentsPage {
  departments: DepartmentInfo[] = [];
}
