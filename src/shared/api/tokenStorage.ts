import * as SecureStore from "expo-secure-store";

import { AUTH_STORAGE_KEYS } from "~/shared/config/auth";

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(AUTH_STORAGE_KEYS.accessToken);
}

export async function setAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_STORAGE_KEYS.accessToken, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(AUTH_STORAGE_KEYS.refreshToken);
}

export async function setRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_STORAGE_KEYS.refreshToken, token);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.accessToken),
    SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.refreshToken),
  ]);
}
