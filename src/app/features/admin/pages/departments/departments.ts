import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-departments',
  imports: [CommonModule],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class Departments {
  departments = [
    { name: 'Engineering', head: 'Nikhil S', members: 5, status: 'Balanced', note: 'Largest request volume with the most planned leave next month.' },
    { name: 'People Ops', head: 'Meera N', members: 2, status: 'Healthy', note: 'Records are complete and leave mapping is stable.' },
    { name: 'Support', head: 'Daniel R', members: 3, status: 'Watch', note: 'Coverage gets tighter during weekends and holiday periods.' },
    { name: 'Finance', head: 'Aparna T', members: 2, status: 'Healthy', note: 'No pending quota issues for the current cycle.' },
  ]; // db on init
}
