import { Injectable, inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { unwrapApiResponse } from '../../../../core/dtos/api/api-response.utils';
import { AdminTeamApi } from '../../../../core/http/team/admin-team-api';
import { NotificationService } from '../../../../shared/services/notification.service';
import {
  CreateTeamDTO,
  EditTeamDTO,
  TeamDTO,
  TeamManagerOptionDTO,
} from '../../../../core/dtos/team/team.model';

@Injectable({
  providedIn: 'root',
})
export class AdminTeamService {
  private readonly api = inject(AdminTeamApi);
  private readonly notifications = inject(NotificationService);

  loadTeams(): Observable<TeamDTO[]> {
    return this.api.getAllTeams().pipe(
      map((response) =>
        unwrapApiResponse(response, {
          fallback: [],
          onError: this.handleServiceError,
        }),
      ),
    );
  }

  loadAvailableManagers(): Observable<TeamManagerOptionDTO[]> {
    return this.api.getAvailableManagers().pipe(
      map((response) =>
        unwrapApiResponse(response, {
          fallback: [],
          onError: this.handleServiceError,
        }),
      ),
    );
  }

  createTeam(dto: CreateTeamDTO): Observable<TeamDTO> {
    return this.api.createTeam(dto).pipe(
      map((response) =>
        unwrapApiResponse(response, {
          onError: this.handleServiceError,
        }),
      ),
      tap(() => this.notifications.showSuccess('Team created successfully.')),
    );
  }

  editTeam(teamId: number, dto: EditTeamDTO): Observable<TeamDTO> {
    return this.api.editTeam(teamId, dto).pipe(
      map((response) =>
        unwrapApiResponse(response, {
          onError: this.handleServiceError,
        }),
      ),
      tap(() => this.notifications.showSuccess('Team updated successfully.')),
    );
  }

  assignTeamManager(teamId: number, managerId: number): Observable<TeamDTO> {
    return this.api.assignTeamManager(teamId, managerId).pipe(
      map((response) =>
        unwrapApiResponse(response, {
          onError: this.handleServiceError,
        }),
      ),
      tap(() => this.notifications.showSuccess('Manager assigned successfully.')),
    );
  }

  private handleServiceError = (message: string): void => {
    this.notifications.showError(message);
  };
}
