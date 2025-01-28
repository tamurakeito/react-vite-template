export type User = {
  id: number;
  userId: string;
  name: string;
  session: number;
};

export type SignInRequest = {
  userId: string;
  password: string;
};

export type SignInResponse = {
  id: number;
  userId: string;
  name: string;
  token: string;
};

export type SignUpRequest = {
  userId: string;
  password: string;
  name: string;
};

export type SignUpResponse = {
  id: number;
  userId: string;
  name: string;
  token: string;
};
