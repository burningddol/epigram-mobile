import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { env } from "~/shared/config/env";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "./tokenStorage";

const REFRESH_ENDPOINT = "/auth/refresh-token";
const AUTH_PUBLIC_ENDPOINTS = [
  "/auth/signIn",
  "/auth/signUp",
  "/auth/signIn/kakao",
];

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let onSessionExpired: (() => void) | null = null;

export function setOnSessionExpired(callback: (() => void) | null): void {
  onSessionExpired = callback;
}

export const apiClient = axios.create({
  baseURL: `${env.apiBase}/${env.teamId}`,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axios.post<{ accessToken: string }>(
    `${env.apiBase}/${env.teamId}${REFRESH_ENDPOINT}`,
    { refreshToken },
    { timeout: 10000 },
  );
  await setAccessToken(response.data.accessToken);
  return response.data.accessToken;
}

function getOrStartRefresh(): Promise<string> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = performRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

function isPublicAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  if (url.includes(REFRESH_ENDPOINT)) return true;
  return AUTH_PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (!config || status !== 401 || config._retry) {
      return Promise.reject(error);
    }
    if (isPublicAuthEndpoint(config.url)) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const newAccessToken = await getOrStartRefresh();
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(config);
    } catch (refreshError) {
      await clearTokens();
      onSessionExpired?.();
      return Promise.reject(refreshError);
    }
  },
);
