export interface CreateUserRequestDTO {
  name: string;
  email: string;
  password: string;
  departmentId: number;
  roleId: number;
}