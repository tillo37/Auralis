import { env } from '../env';
import { getToken } from '../auth';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    return url.toString();
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, body, headers: extraHeaders, ...init } = options;
    const url = this.buildUrl(path, params);

    const headers: Record<string, string> = {};

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    if (extraHeaders) {
      Object.assign(headers, extraHeaders);
    }

    const res = await fetch(url, { headers, body, ...init });

    // Handle empty bodies (e.g., 204 No Content)
    const text = await res.text();
    const data = text.length > 0 ? (JSON.parse(text) as unknown) : null;

    if (!res.ok) {
      const errData = data as Record<string, unknown> | null;
      const msg = (errData?.message as string | string[] | undefined) ?? `Request failed: ${res.status}`;
      throw new ApiError(res.status, Array.isArray(msg) ? msg[0] : msg);
    }

    return data as T;
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(`${env.NEXT_PUBLIC_API_URL}/api/v1`);
