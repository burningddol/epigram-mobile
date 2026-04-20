import { apiClient } from "~/shared/api/client";
import { setAccessToken, setRefreshToken } from "~/shared/api/tokenStorage";

import type { SignInResponse } from "../model/types";

export interface SignInKakaoBody {
  token: string;
  redirectUri: string;
}

export async function signInKakao(body: SignInKakaoBody): Promise<SignInResponse> {
  const response = await apiClient.post<SignInResponse>("/auth/signIn/kakao", body);
  await Promise.all([
    setAccessToken(response.data.accessToken),
    setRefreshToken(response.data.refreshToken),
  ]);
  return response.data;
}
