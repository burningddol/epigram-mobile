import { apiClient } from "~/shared/api/client";
import { clearTokens, setAccessToken, setRefreshToken } from "~/shared/api/tokenStorage";

import type { SignInResponse, SignUpResponse } from "../model/types";

export interface SignUpBody {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}

export interface SignInBody {
  email: string;
  password: string;
}

async function persistTokens(tokens: { accessToken: string; refreshToken: string }): Promise<void> {
  await Promise.all([setAccessToken(tokens.accessToken), setRefreshToken(tokens.refreshToken)]);
}

export async function signUp(body: SignUpBody): Promise<SignUpResponse> {
  const response = await apiClient.post<SignUpResponse>("/auth/signUp", body);
  await persistTokens(response.data);
  return response.data;
}

export async function signIn(body: SignInBody): Promise<SignInResponse> {
  const response = await apiClient.post<SignInResponse>("/auth/signIn", body);
  await persistTokens(response.data);
  return response.data;
}

export async function logout(): Promise<void> {
  await clearTokens();
}
