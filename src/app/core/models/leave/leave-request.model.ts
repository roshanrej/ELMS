import { LeaveTypeEnum } from "../../types-enums/leave-type-enum";


export interface  LeaveRequestModel  {
    leaveType : LeaveTypeEnum | null,
    startDate : Date,
    endDate : Date,
    reason : string
}