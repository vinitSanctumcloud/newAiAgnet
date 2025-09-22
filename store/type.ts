// store/types.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  name: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}