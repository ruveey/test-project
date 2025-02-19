export interface UserCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  name?: string;
  is_online: boolean;
} 