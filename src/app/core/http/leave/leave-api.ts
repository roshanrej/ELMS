import { Injectable, inject } from '@angular/core';
import { LeaveModel } from '../../models/leave-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class LeaveApi {
  private http :HttpClient = inject(HttpClient)
  getEmployeeLeaves():Observable<LeaveModel[]|null>{
    return this.http.get<LeaveModel[]>('http://localhost:3000/api/leaves',{
      headers:{
        "userId":"1"
      }
    });
  }
}
