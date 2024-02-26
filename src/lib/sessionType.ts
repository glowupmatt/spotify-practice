interface User {
  name: string;
  email: string;
  image: string;
  access_token: string;
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id: string;
}

export interface Data {
  user: User;
}

export interface RootObject {
  data: Data;
  status: "authenticated" | "unauthenticated";
}
