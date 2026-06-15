import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AdminLeaveTypeApi } from '../../../../core/http/leave-type/admin-leave-type-api';
import {
  unwrapApiResponse,
} from '../../../../core/dtos/api/api-response.utils';
import { NotificationService } from '../../../../shared/services/notification.service';
import { LeaveTypeProjectionDTO } from '../../../../core/dtos/leave-type/leave-type.projection.dto';
import { CreateLeaveTypeDTO } from '../../../../core/dtos/leave-type/create-leave-type.dto';
import { CreateLeaveTypeResponseDTO } from '../../../../core/dtos/leave-type/create-leave-type-response.dto';
import { UpdateLeaveTypeStatusDTO } from '../../../../core/dtos/leave-type/update-leave-type-status.dto';
import { RenameLeaveTypeDTO } from '../../../../core/dtos/leave-type/rename-leave-type.dto';

@Injectable({
  providedIn: 'root',
})
export class AdminLeaveTypeService {
  private api = inject(AdminLeaveTypeApi);
  private notifications = inject(NotificationService);

  private showApiError = (message: string): void => {
    this.notifications.showError(message);
  };

  createLeaveType(dto: CreateLeaveTypeDTO): Observable<CreateLeaveTypeResponseDTO> {
    return this.api
      .createLeaveType(dto)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  getAllLeaveTypes(): Observable<LeaveTypeProjectionDTO[]> {
    return this.api
      .getAllLeaveTypes()
      .pipe(map((res) => unwrapApiResponse(res, { fallback: [], onError: this.showApiError })));
  }

  updateStatus(id: number, dto: UpdateLeaveTypeStatusDTO): Observable<LeaveTypeProjectionDTO> {
    return this.api
      .updateStatus(id, dto)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  rename(id: number, dto: RenameLeaveTypeDTO): Observable<LeaveTypeProjectionDTO> {
    return this.api
      .rename(id, dto)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }
}
