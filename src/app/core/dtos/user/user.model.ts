import { ROLE_TYPE } from '../../types-enums/role-type.enum';

export interface UserContextDTO {
  name: string;
  email: string;
  role: ROLE_TYPE;
  department: string | null;
}