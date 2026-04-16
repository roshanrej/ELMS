import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AdminSidebar{
     label: string,
     route : string
   }
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  
  adminSidebar : AdminSidebar[]=[
    {label:"Departments", route:"admin/departments"},
    {label:"Employees", route:"admin/employees"},
    {label:"Leave Quotas", route:"admin/leave-quotas"},

  ] 
}
