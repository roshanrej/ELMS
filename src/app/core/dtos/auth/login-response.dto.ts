import { UserContextDTO } from "../user/user.model";

export interface LoginResponseDTO {
  user: UserContextDTO;
  accessToken: string;
  refreshToken: string;
}

export interface AccessTokenResponseDTO {
  accessToken: string;
  user: UserContextDTO;
}