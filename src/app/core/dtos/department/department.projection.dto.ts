import { DepartmentStatusEnum } from '../../types-enums/department-status.enum';

export interface DepartmentProjectionDTO {
  id: number;
  name: string;
  status: DepartmentStatusEnum;
  memberCount: number;
}