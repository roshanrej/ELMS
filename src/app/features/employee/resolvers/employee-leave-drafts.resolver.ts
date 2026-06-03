import { inject } from "@angular/core";
import { LeaveRequestProjectionDTO } from "../../../core/dtos/leave-request/leave-request.projection.dto";
import { ResolveFn } from "@angular/router";
import { LeaveService } from "../services/leave-requests/leave-request.service";
export const employeeLeaveDraftsResolver: ResolveFn<LeaveRequestProjectionDTO[]> =  ()=>
{
const service = inject(LeaveService)
return service.getEmployeeLeaveDrafts();
}