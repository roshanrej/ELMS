import { LeaveTypeEnum } from "../../types-enums/leave-type-enum";


export interface  LeaveRequestModel  {
    leaveType : LeaveTypeEnum | null,
    startDate : Date | null,
    endDate : Date | null,
    reason : string
}