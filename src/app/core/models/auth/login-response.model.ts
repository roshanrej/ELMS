import { RoleType } from "../../types-enums/role-type.enum";

/**
 * ARCHITECTURAL NOTE:
 * This model represents what the server returns on login.
 * It should only contain data, not authorization logic.
 * Backend is responsible for all authorization decisions.
 */
export class LoginResponse {
  constructor(
    readonly name: string,
    readonly role: RoleType,
    readonly email: string,
    readonly accessToken ?: string,
    readonly refreshToken ?: string,
    readonly department?: string
  ) {}
}