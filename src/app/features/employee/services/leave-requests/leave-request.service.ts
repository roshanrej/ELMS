import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LeaveRequestApi } from '../../../../core/http/leave-request/leave-request-api';
import { LeaveRequestProjectionDTO } from '../../../../core/dtos/leave-request/leave-request.projection.dto';
import { CreateLeaveRequestDTO } from '../../../../core/dtos/leave-request/create-leave-request.dto';
import { ApiResponseDTO } from '../../../../core/dtos/api/api-response.model';
import { EmployeeLeaveRequestDTO } from '../../../../core/dtos/leave-request/employee-leave-request.dto';
import { NotificationService } from '../../../../shared/services/notification.service';

/**
 * Thin employee leave service.
 * Delegates to backend via API layer.
 * Components receive projections directly.
 * NO local workflow logic - use allowedActions from projection.
 */
@Injectable({
  providedIn: 'root',
})
export class LeaveService {
    
  private leaveRequestApi = inject(LeaveRequestApi);
  private notifications = inject(NotificationService);
 

  getEmployeeLeaveDrafts(): Observable<LeaveRequestProjectionDTO[]> {
    return this.leaveRequestApi.getEmployeeLeaveDrafts().pipe(
      map(res => this.unwrap(res, []))
    );
  }

  getEmployeeActiveLeaveRequests(): Observable<EmployeeLeaveRequestDTO[]> {
    return this.leaveRequestApi.getEmployeeLeaveRequests().pipe(
      map(res => this.unwrap(res, []))
    );
  }

  getEmployeeLeaveRequestsProjections(): Observable<LeaveRequestProjectionDTO[]> {
    return this.leaveRequestApi.getEmployeeLeaveProjections().pipe(
      map(res => this.unwrap(res, []))
    );
  }

 submitExistingLeaveRequest(id: number) : Observable<LeaveRequestProjectionDTO>{
  return this.leaveRequestApi.submitExistingLeaveRequest(id).pipe(
    map(res => this.unwrap(res))
  );
 }

 cancelLeaveRequest(id:number) : Observable<LeaveRequestProjectionDTO>{
   return this.leaveRequestApi.cancelLeaveRequest(id).pipe(
    map(res => this.unwrap(res))
  );
 }

 requestLeaveCancellation(id :number ): Observable<LeaveRequestProjectionDTO>
 {
   return this.leaveRequestApi.requestLeaveCancellation(id).pipe(
    map(res => this.unwrap(res))
  );
 }

  submitLeaveRequest(dto: CreateLeaveRequestDTO): Observable<LeaveRequestProjectionDTO> {
    return this.leaveRequestApi.submitNewLeaveRequest(dto).pipe(
      map(res => this.unwrap(res)));
    
  }

createLeaveDraft(dto : CreateLeaveRequestDTO): Observable<LeaveRequestProjectionDTO>{
 return this.leaveRequestApi.createLeaveDraft(dto).pipe(
      map(res => this.unwrap(res))
    );
}

editLeaveDraft(id: number, dto: CreateLeaveRequestDTO): Observable<LeaveRequestProjectionDTO> {
 return this.leaveRequestApi.editLeaveDraft(id, dto).pipe(
      map(res => this.unwrap(res))
    );
}

deleteLeaveDraft(id: number): Observable<void> {

  return this.leaveRequestApi.deleteLeaveDraft(id).pipe(
    map(res => this.unwrapVoid(res))
  );
}

private unwrap<T>(response: ApiResponseDTO<T>, fallback?: T): T {
  if (!response.success) {
    const message = response.message || 'Request failed.';
    this.notifications.showError(message);
    throw new Error(message);
  }

  if (response.data !== null) {
    return response.data;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  const message = response.message || 'Response did not include required data.';
  this.notifications.showError(message);
  throw new Error(message);
}

private unwrapVoid(response: ApiResponseDTO<null>): void {
  if (!response.success) {
    const message = response.message || 'Request failed.';
    this.notifications.showError(message);
    throw new Error(message);
  }
}
 

}

