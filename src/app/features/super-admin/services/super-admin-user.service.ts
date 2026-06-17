import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { unwrapApiResponse } from '../../../core/dtos/api/api-response.utils';
import { CreateUserRequestDTO } from '../../../core/dtos/user/create-user-request.dto';
import { UserProjectionDTO } from '../../../core/dtos/user/user-projection.dto';
import { SuperAdminUserApi } from '../../../core/http/user/super-admin-user-api';
import { NotificationService } from '../../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminUserService {
  private readonly api = inject(SuperAdminUserApi);
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

  createUser(payload: CreateUserRequestDTO): Observable<UserProjectionDTO> {
    return this.api.createUser(payload).pipe(
      map((response) =>
        unwrapApiResponse(response, {
          onError: this.handleServiceError,
        }),
      ),
    );
  }

  activateUser(userId: number): Observable<UserProjectionDTO> {
    return this.api.activateUser(userId).pipe(
      map((response) =>
        unwrapApiResponse(response, {
          onError: this.handleServiceError,
        }),
      ),
    );
  }

  deactivateUser(userId: number): Observable<UserProjectionDTO> {
    return this.api.deactivateUser(userId).pipe(
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