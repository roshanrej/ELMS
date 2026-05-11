import { RoleTypeEnum } from "../../types-enums/role-type.enum"
export interface LoginResponse{
  email : string,
  name :string,
  role :RoleTypeEnum
}