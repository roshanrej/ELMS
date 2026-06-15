import { ROLE_TYPE } from '../../types-enums/role-type.enum';
import { UserStatusEnum } from '../../types-enums/user-status.enum';

export interface UserProjectionDTO {
  id: number;
  teamName: string;
  email: string;
  name: string;
  role: ROLE_TYPE;
  department: string;
  status: UserStatusEnum;
}