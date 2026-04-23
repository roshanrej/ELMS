import { RoleTypeEnum } from "../../types-enums/role-type.enum"
export interface LoginResponse{
  id: number,
  email : string,
  name :string,
  role :RoleTypeEnum
}