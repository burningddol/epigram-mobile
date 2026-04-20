export interface UserWithEmail {
  id: number;
  nickname: string;
  email: string;
  image: string | null;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpResponse extends AuthTokens {
  user: UserWithEmail;
}

export interface SignInResponse extends AuthTokens {
  user: UserWithEmail;
}
