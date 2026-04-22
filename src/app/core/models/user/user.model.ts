
import { DepartmentEnum } from "../../types-enums/department-enum";
import { RoleTypeEnum } from '../../types-enums/role-type.enum';

export interface UserModel {
  id: number,
  email: string;
  name: string;
  role: RoleTypeEnum;
  department: DepartmentEnum;
  createdAt: Date;
}