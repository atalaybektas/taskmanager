/**
 * User role enum
 */
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

/**
 * User model interface
 */
export interface User {
  id: number;
  username: string;
  role?: Role;
}

/**
 * Login request interface
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  id: number;
  username: string;
  role: Role;
  token: string;
}
