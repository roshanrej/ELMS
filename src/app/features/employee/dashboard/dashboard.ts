import { Component } from '@angular/core';


interface UserModel{
  id: number;
  name: string;
  role: string;
  status: string;
}
enum LeaveStatus {
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Cancelled = "CANCELLED"
}
interface LeaveModel{
  id : number,
  userId : number,
  reason : string,
  startDate : string,
  endDate : string,
  status : LeaveStatus

}
 
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  user: UserModel = 
  { id: 1, name: 'Rosh', role: 'EMPLOYEE', status: 'ACTIVE' }
  //{ id: 2, name: 'Admin', role: 'ADMIN', status: 'ACTIVE' 
  leaves : LeaveModel[]=[
    {id:1, userId:1, reason:"Sick", startDate:"01-02-2026", endDate:"08-02-2026", status:LeaveStatus.Approved},
    {id:2, userId:1, reason:"Sick", startDate:"01-02-2026", endDate:"08-02-2026", status:LeaveStatus.Approved},
    {id:3, userId:1, reason:"Sick", startDate:"01-02-2026", endDate:"08-02-2026", status:LeaveStatus.Approved},
    {id:4, userId:1, reason:"Sick", startDate:"01-02-2026", endDate:"08-02-2026", status:LeaveStatus.Approved},
    {id:5, userId:1, reason:"Sick", startDate:"01-02-2026", endDate:"08-02-2026", status:LeaveStatus.Approved}
  ]




 
}
