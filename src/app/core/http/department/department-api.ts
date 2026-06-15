import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { DepartmentProjectionDTO } from '../../dtos/department/department.projection.dto';

@Injectable({
  providedIn: 'root',
})
export class DepartmentApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getDepartments(): Observable<ApiResponseDTO<DepartmentProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<DepartmentProjectionDTO[]>>(
      `${this.baseUrl}/admin/api/departments`,
    );
  }
}