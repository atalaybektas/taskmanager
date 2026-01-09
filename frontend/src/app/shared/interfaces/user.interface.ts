
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}


export interface User {
  id: number;
  username: string;
  role?: Role;
}


export interface LoginRequest {
  username: string;
  password: string;
}


export interface LoginResponse {
  id: number;
  username: string;
  role: Role;
  token: string;
}
