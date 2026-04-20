import axios from "axios";

import { env } from "~/shared/config/env";

import { getAccessToken } from "./tokenStorage";

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
