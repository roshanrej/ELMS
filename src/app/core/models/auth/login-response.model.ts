
import { RoleTypeEnum } from "../../types-enums/role-type.enum";

export class LoginResponse {



  constructor(
    readonly name: string,
    readonly role: RoleTypeEnum,
    readonly email: string,
    readonly accessToken ?: string,
    readonly refreshToken ?: string,
    readonly department?: string
  ) {}


  isAdmin(): boolean {
    return this.role === RoleTypeEnum.ADMIN;
  }
  isEmployee(): boolean{
    return this.role === RoleTypeEnum.EMPLOYEE;
  }
  isManager(): boolean{
    return this.role === RoleTypeEnum.MANAGER
  }
}