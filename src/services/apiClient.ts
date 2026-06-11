import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/authStore";

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  isUnauthorized: boolean;
};

export type ApiSuccessResponse<T = unknown> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  data: null;
  message: string;
  error: ApiError;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

const DEFAULT_TIMEOUT = 30000;

const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL ?? "";
const isBrowser = () => typeof window !== "undefined";

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  // timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? DEFAULT_TIMEOUT),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    const language = isBrowser() ? window.localStorage.getItem('i18nextLng') ?? 'en' : 'en';

    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set('accept', 'application/json, text/plain, */*');
    config.headers.set('APP_NAME', 'Matnext');
    config.headers.set('country', 'in');
    config.headers.set('Accept-language', language)
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().clearAuthData();

      if (isBrowser()) {
        window.dispatchEvent(new CustomEvent("api:unauthorized"));
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
