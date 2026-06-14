import { EmployeeLeaveRequestDTO } from "./employee-leave-request.dto";

        export interface ManagerDashboardLeaveProjectionDTO {
            email : string,
            name : string,
            leaveRequest : EmployeeLeaveRequestDTO
        }
