import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of, catchError } from 'rxjs';
import { TeamDTO } from '../../../core/dtos/team/team.model';
import { AdminTeamService } from '../services/team/admin-team.service';

export const adminTeamsResolver: ResolveFn<TeamDTO[]> = () => {
  return inject(AdminTeamService)
    .loadTeams()
    .pipe(catchError(() => of([])));
};
