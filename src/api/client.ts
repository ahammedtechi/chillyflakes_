import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { NormalizedApiError } from '../types/auth';

/**
 * Base URL resolution:
 * VITE_API_BASE_URL (defaults to http://localhost:8000/api or /api)
 */
export const RAW_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').trim().replace(/\/$/, '');

/**
 * Extracts Django CSRF cookie token from browser cookies.
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Retrieves authentication token (JWT access token or DRF Token) if any.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || localStorage.getItem('token');
}

/**
 * Saves authentication token in localStorage (used only by legacy buyer flows).
 */
export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
  }
}

let onUnauthorizedCallback: (() => void) | null = null;

export function setOnUnauthorizedCallback(cb: (() => void) | null): void {
  onUnauthorizedCallback = cb;
}

/**
 * Configured Axios Client:
 * - baseURL from VITE_API_BASE_URL
 * - withCredentials: true
 * - request interceptor to prevent URL doubling (e.g. /api/api/v1/...) and attach CSRF
 * - response interceptor that normalizes every error to { code, message, fieldErrors? }
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: RAW_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: prevent duplicate `/api/` prefixes and attach headers
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url) {
    const baseEndsWithApi = (config.baseURL || '').replace(/\/$/, '').endsWith('/api');
    // If baseURL already ends with /api, strip redundant /api or api/ from url
    if (baseEndsWithApi && /^\/?api\//.test(config.url)) {
      config.url = config.url.replace(/^\/?api\//, '');
    }
  }

  // Django CSRF token
  const csrf = getCsrfToken();
  if (csrf && config.headers) {
    config.headers['X-CSRFToken'] = csrf;
  }

  // Attach token if present
  const token = getAuthToken();
  if (token && config.headers && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor: normalize error to { code: string, message: string, fieldErrors?: Record<string, string[]> }
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Record<string, unknown>>) => {
    let normalized: NormalizedApiError = {
      code: 'network_error',
      message: 'Network error or server unreachable. Please check your connection.',
    };

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      let fieldErrors: Record<string, string[]> | undefined = undefined;

      if (data && typeof data === 'object') {
        if ('fieldErrors' in data && typeof data.fieldErrors === 'object' && data.fieldErrors !== null) {
          fieldErrors = data.fieldErrors as Record<string, string[]>;
        } else {
          // Check for standard DRF error dictionary e.g. { email: ["already exists"] }
          const extracted: Record<string, string[]> = {};
          let foundField = false;
          for (const [key, val] of Object.entries(data)) {
            if (key !== 'code' && key !== 'message' && key !== 'detail') {
              if (Array.isArray(val) && val.every((item) => typeof item === 'string')) {
                extracted[key] = val;
                foundField = true;
              } else if (typeof val === 'string') {
                extracted[key] = [val];
                foundField = true;
              }
            }
          }
          if (foundField) {
            fieldErrors = extracted;
          }
        }
      }

      let retryAfterSeconds: number | undefined = undefined;
      if (typeof data?.retry_after_seconds === 'number') {
        retryAfterSeconds = data.retry_after_seconds;
      } else if (error.response.headers && error.response.headers['retry-after']) {
        const parsed = parseInt(String(error.response.headers['retry-after']), 10);
        if (!isNaN(parsed)) retryAfterSeconds = parsed;
      }

      const defaultMsg = status === 400 ? 'Please fix the validation errors.' : `Request failed with status ${status}`;
      const msg = typeof data?.message === 'string' 
        ? data.message 
        : typeof data?.detail === 'string' 
          ? data.detail 
          : defaultMsg;

      normalized = {
        code: (typeof data?.code === 'string' ? data.code : undefined) || `http_${status}`,
        message: msg,
        fieldErrors,
        retry_after_seconds: retryAfterSeconds,
      };

      // On a 401 from any call OTHER than login and me, clear user session and redirect to /vendor/login without redirect loop
      if (status === 401) {
        const reqUrl = error.config?.url || '';
        const isAuthEndpoint = reqUrl.includes('/auth/login') || reqUrl.includes('/auth/me');
        if (!isAuthEndpoint) {
          if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
          }
          if (typeof window !== 'undefined' && window.location.pathname !== '/vendor/login') {
            window.location.assign('/vendor/login');
          }
        }
      }
    } else if (error.request) {
      normalized = {
        code: 'no_response',
        message: 'No response received from server. Please check your network or try again.',
      };
    } else {
      normalized = {
        code: 'request_error',
        message: error.message || 'An unexpected error occurred.',
      };
    }

    return Promise.reject(normalized);
  }
);

/* -------------------------------------------------------------------------- */
/* Backward Compatibility Adapter for Existing Buyer Landing Page API Files  */
/* -------------------------------------------------------------------------- */

export interface ApiResponse<T> {
  data: T;
  status: number;
  isMock: boolean;
  error?: string | null;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: { method?: string; body?: unknown; headers?: Record<string, string>; timeoutMs?: number } = {},
  fallbackData?: T
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosClient.request<T>({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body,
      headers: options.headers,
      timeout: options.timeoutMs ?? 4000,
    });

    const rawData = response.data;
    const isObject = rawData && typeof rawData === 'object';
    const hasResults = isObject && 'results' in (rawData as unknown as Record<string, unknown>);
    const results = hasResults ? (rawData as unknown as { results: unknown }).results : undefined;
    const data: T = Array.isArray(results) ? (results as T) : rawData;

    return {
      data,
      status: response.status,
      isMock: false,
    };
  } catch (error) {
    if (fallbackData !== undefined) {
      return {
        data: fallbackData,
        status: 200,
        isMock: true,
      };
    }

    const norm = error as NormalizedApiError;
    return {
      data: (null as unknown) as T,
      status: 500,
      isMock: false,
      error: norm?.message || 'Request failed',
    };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, fallback?: T, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }, fallback),

  post: <T>(endpoint: string, body?: unknown, fallback?: T, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'POST', body, ...options }, fallback),

  put: <T>(endpoint: string, body?: unknown, fallback?: T, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, ...options }, fallback),

  patch: <T>(endpoint: string, body?: unknown, fallback?: T, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body, ...options }, fallback),

  delete: <T>(endpoint: string, fallback?: T, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }, fallback),
};

export default axiosClient;
