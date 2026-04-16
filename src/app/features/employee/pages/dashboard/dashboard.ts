import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


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
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {




 
}
