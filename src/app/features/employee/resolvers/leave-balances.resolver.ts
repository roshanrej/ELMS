import { ResolveFn } from "@angular/router";
import { LeaveBalanceModel } from "../../../core/models/leave/leave-balance.model";
import { of ,catchError} from "rxjs";
import { inject } from "@angular/core";
import { LeaveService } from "../../../core/services/leave/leave.service";

export const leaveBalancesResolver: ResolveFn<LeaveBalanceModel[]> = () => {
  return inject(LeaveService)
    .getMyBalances()
    .pipe(catchError(() => of([])));
};
