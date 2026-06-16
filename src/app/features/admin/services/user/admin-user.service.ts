import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { unwrapApiResponse } from '../../../../core/dtos/api/api-response.utils';
import { UserProjectionDTO } from '../../../../core/dtos/user/user-projection.dto';
import { AdminUserApi } from '../../../../core/http/user/admin-user-api';
import { NotificationService } from '../../../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private readonly api = inject(AdminUserApi);
  private readonly notifications = inject(NotificationService);

  loadUsers(): Observable<UserProjectionDTO[]> {
    return this.api.getUsers().pipe(
      map((response) =>
        unwrapApiResponse(response, {
          fallback: [],
          onError: this.handleServiceError,
        }),
      ),
    );
  }

  assignUserToTeam(userId: number, teamId: number): Observable<UserProjectionDTO> {
    return this.api.assignUserToTeam(userId, teamId).pipe(
      map((response) =>
        unwrapApiResponse(response, {
          onError: this.handleServiceError,
        }),
      ),
    );
  }

  private handleServiceError = (message: string): void => {
    this.notifications.showError(message);
  };
}