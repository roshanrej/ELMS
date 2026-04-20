
import { Department } from '../../auth/services/auth'
import { RoleTypeEnum } from './role.model';

export interface UserModel {
  id: number,
  email: string;
  name: string;
  role: RoleTypeEnum;
  department: Department;
  createdAt: Date;
}