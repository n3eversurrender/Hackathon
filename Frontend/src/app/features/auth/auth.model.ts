export interface RegisterRequest {
  name: string;
  email: string;
  username?: string;
  password: string;
  role?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role: number;
  role_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  data: User | { access_token: string; user: User } | null;
}
