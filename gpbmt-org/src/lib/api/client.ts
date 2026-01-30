/**
 * API Client
 *
 * Centralized HTTP client for making API requests.
 * Handles authentication, error formatting, and response parsing.
 */

import { ApiError, type ApiErrorResponse } from '@/types/api.types';

const API_BASE_URL = '/api/v1';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

/**
 * Build URL with query parameters
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Parse API error response
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const data = (await response.json()) as ApiErrorResponse;
    return new ApiError(
      data.error?.code || 'UNKNOWN_ERROR',
      data.error?.message || 'An unknown error occurred',
      response.status,
      data.error?.details
    );
  } catch {
    return new ApiError(
      'PARSE_ERROR',
      `Request failed with status ${response.status}`,
      response.status
    );
  }
}

/**
 * Make an API request
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, body, headers: customHeaders, ...fetchOptions } = options;

  const url = buildUrl(endpoint, params);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

/**
 * API client with typed methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get<T>(
    endpoint: string,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post<T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body: data });
  },

  /**
   * PATCH request
   */
  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PATCH', body: data });
  },

  /**
   * PUT request
   */
  put<T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PUT', body: data });
  },

  /**
   * DELETE request
   */
  delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
