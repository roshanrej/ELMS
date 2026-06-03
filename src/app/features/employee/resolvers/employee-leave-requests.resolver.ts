import { EmployeeLeaveRequestDTO } from "../../../core/dtos/leave-request/employee-leave-request.dto";
import { ResolveFn } from "@angular/router";
import { LeaveService } from "../services/leave-requests/leave-request.service";
import { inject } from "@angular/core";
import { LeaveRequestProjectionDTO } from "../../../core/dtos/leave-request/leave-request.projection.dto";


export const employeeActiveLeaveRequestsResolver : ResolveFn<EmployeeLeaveRequestDTO[]> = ()=>{
   const service = inject(LeaveService)
   return service.getEmployeeActiveLeaveRequests();
};


export const employeeLeaveRequestsResolver : ResolveFn<LeaveRequestProjectionDTO[]> = ()=>{
   const service = inject(LeaveService)
   return service.getEmployeeLeaveRequestsProjections();
};
