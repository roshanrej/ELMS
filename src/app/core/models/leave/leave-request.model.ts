import { LeaveTypeEnum } from "../../types-enums/leave-type-enum";


export interface  LeaveRequestModel  {
    leaveType : LeaveTypeEnum,
    startDate : Date,
    endDate : Date,
    reason : string
}