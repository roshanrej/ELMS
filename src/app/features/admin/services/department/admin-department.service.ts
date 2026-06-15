import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { unwrapApiResponse } from '../../../../core/dtos/api/api-response.utils';
import { DepartmentProjectionDTO } from '../../../../core/dtos/department/department.projection.dto';
import { DepartmentApi } from '../../../../core/http/department/department-api';
import { NotificationService } from '../../../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AdminDepartmentService {
  private readonly api = inject(DepartmentApi);
  private readonly notifications = inject(NotificationService);

  loadDepartments(): Observable<DepartmentProjectionDTO[]> {
    return this.api.getDepartments().pipe(
      map((response) =>
        unwrapApiResponse(response, {
          fallback: [],
          onError: this.handleServiceError,
        }),
      ),
    );
  }

  private handleServiceError = (message: string): void => {
    this.notifications.showError(message);
  };
}