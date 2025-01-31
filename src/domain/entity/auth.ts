export interface User {
  id: number;
  userId: string;
  name: string;
  session: number;
}

export interface SignInRequest {
  userId: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  userId: string;
  name: string;
  token: string;
}

export interface SignUpRequest {
  userId: string;
  password: string;
  name: string;
}

export interface SignUpResponse {
  id: number;
  userId: string;
  name: string;
  token: string;
}
