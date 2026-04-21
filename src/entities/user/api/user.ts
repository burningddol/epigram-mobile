import { apiClient } from "~/shared/api/client";
import { getAccessToken, getRefreshToken } from "~/shared/api/tokenStorage";

import { userSchema, type User } from "../model/schema";

export interface UpdateMeBody {
  nickname?: string;
  image?: string;
}

export async function getMe(): Promise<User | null> {
  const [access, refresh] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);
  if (!access && !refresh) return null;

  const response = await apiClient.get<User | null>("/users/me");
  if (response.data === null) return null;
  return userSchema.parse(response.data);
}

export async function updateMe(body: UpdateMeBody): Promise<User> {
  const response = await apiClient.patch("/users/me", body);
  return userSchema.parse(response.data);
}
