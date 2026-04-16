
import { Department } from '../../auth/services/auth'
import { RoleType } from './role.model';

export interface UserModel {
  id: number,
  email: string;
  name: string;
  role: RoleType;
  department: Department;
  createdAt: Date;
}