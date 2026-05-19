import { LeaveTypeStatusEnum } from "../../types-enums/leave-type-status-enum";

export class LeaveTypeModel{
    constructor(
        readonly id:number,
        readonly name:string,
        readonly status: LeaveTypeStatusEnum
    ){

    }

}
