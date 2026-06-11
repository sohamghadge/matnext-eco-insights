import axios, { type AxiosRequestConfig, type Method } from "axios";
import apiClient from "./apiClient";

type RequestOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
};

const request = async <TResponse = unknown, TPayload = unknown>(
  method: Method,
  url: string,
  payload?: TPayload,
  options: RequestOptions = {},
): Promise<TResponse> => {
  try {
    const response = await apiClient.request<TResponse>({
      url,
      method,
      data: payload,
      params: options.params,
      headers: options.headers,
      ...options.config,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as TResponse;
    }

    const message = error instanceof Error
      ? error.message
      : "Something went wrong. Please try again.";

    return {
      success: false,
      data: null,
      message,
      error: {
        message,
        isUnauthorized: false,
      },
    } as TResponse;
  }
};

export const get = async<TResponse = unknown>(
  url: string,
  params?: Record<string, unknown>,
  headers?: Record<string, string>,
  config?: AxiosRequestConfig,
) => {
  return request<TResponse>("GET", url, undefined, { params, headers, config });
};

export const post = <TResponse = unknown, TPayload = unknown>(
  url: string,
  payload?: TPayload,
  headers?: Record<string, string>,
  config?: AxiosRequestConfig,
) => request<TResponse, TPayload>("POST", url, payload, { headers, config });

export const patch = <TResponse = unknown, TPayload = unknown>(
  url: string,
  payload?: TPayload,
  headers?: Record<string, string>,
  config?: AxiosRequestConfig,
) => request<TResponse, TPayload>("PATCH", url, payload, { headers, config });

export const del = <TResponse = unknown>(
  url: string,
  params?: Record<string, unknown>,
  headers?: Record<string, string>,
  config?: AxiosRequestConfig,
) => request<TResponse>("DELETE", url, undefined, { params, headers, config });

export { del as delete };
