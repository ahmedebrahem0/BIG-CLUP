export type UserRole = "admin" | "supplier";

export type AuthUser = {
  id?: number | string;
  name?: string;
  email?: string;
  username?: string;
  role?: UserRole;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user_id: number;
  role: string;
};