export interface TeamDTO {
  id: number;
  teamName: string;
  managerName: string | null;
}

export interface CreateTeamDTO {
  name: string;
}

export interface EditTeamDTO {
  name: string;
}

export interface TeamManagerOptionDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}
