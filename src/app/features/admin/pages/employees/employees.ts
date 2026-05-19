import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface EmployeeStat {
  label: string;
  value: string;
  note: string;
}

interface EmployeeRecord {
  name: string;
  role: string;
  department: string;
  status: string;
  balance: string;
  email: string;
}

@Component({
  selector: 'app-employees',
  imports: [CommonModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class EmployeesPage {
  employeeStats: EmployeeStat[] = [];
  employees: EmployeeRecord[] = [];
}
