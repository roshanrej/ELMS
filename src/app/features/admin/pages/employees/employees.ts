import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-employees',
  imports: [CommonModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees {
  employeeStats = [
    { label: 'Active Employees', value: '12', note: 'Currently visible in the admin roster' },
    { label: 'On Leave Today', value: '02', note: 'People already away from work today' },
    { label: 'Pending Profiles', value: '04', note: 'Records still waiting for completion' },
  ];// requires functions acting on state

  employees = [
    { name: 'Aisha Joseph', role: 'Frontend Engineer', department: 'Engineering', status: 'Active', balance: '14 days', email: 'aisha.joseph@elms.io' },
    { name: 'Rahul Menon', role: 'QA Analyst', department: 'Engineering', status: 'Review', balance: '10 days', email: 'rahul.menon@elms.io' },
    { name: 'Meera Nair', role: 'HR Executive', department: 'People Ops', status: 'Active', balance: '18 days', email: 'meera.nair@elms.io' },
    { name: 'Daniel Roy', role: 'Support Lead', department: 'Support', status: 'On Leave', balance: '07 days', email: 'daniel.roy@elms.io' },
  ];// employee details UNION leave balance db dummy
}
