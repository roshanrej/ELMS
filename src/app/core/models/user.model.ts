import { Role } from '../../auth/services/auth'
import { Department } from '../../auth/services/auth'
export interface UserModel {
  id: number;
  email: string;
  password : string,
  role: Role;
  name : 'Rosh'
  dept: Department
}
