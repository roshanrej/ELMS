import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import {
  CreateTeamDTO,
  EditTeamDTO,
  TeamDTO,
  TeamManagerOptionDTO,
} from '../../dtos/team/team.model';

@Injectable({
  providedIn: 'root',
})
export class AdminTeamApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getAllTeams(): Observable<ApiResponseDTO<TeamDTO[]>> {
    return this.http.get<ApiResponseDTO<TeamDTO[]>>(
      `${this.baseUrl}/admin/api/teams`
    );
  }

  createTeam(dto: CreateTeamDTO): Observable<ApiResponseDTO<TeamDTO>> {
    return this.http.post<ApiResponseDTO<TeamDTO>>(
      `${this.baseUrl}/admin/api/teams/create`,
      dto
    );
  }

  editTeam(teamId: number, dto: EditTeamDTO): Observable<ApiResponseDTO<TeamDTO>> {
    return this.http.post<ApiResponseDTO<TeamDTO>>(
      `${this.baseUrl}/admin/api/teams/${teamId}/edit`,
      dto
    );
  }

  assignTeamManager(
    teamId: number,
    managerId: number,
  ): Observable<ApiResponseDTO<TeamDTO>> {
    return this.http.patch<ApiResponseDTO<TeamDTO>>(
      `${this.baseUrl}/admin/api/teams/${teamId}/manager/${managerId}`,
      null,
    );
  }

  getAvailableManagers(): Observable<ApiResponseDTO<TeamManagerOptionDTO[]>> {
    return this.http.get<ApiResponseDTO<TeamManagerOptionDTO[]>>(
      `${this.baseUrl}/admin/api/teams/managers?role=MANAGER&status=ACTIVE`
    );
  }
}
