const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Refresh token mutex — avoid concurrent refresh calls
let refreshPromise: Promise<void> | null = null;

async function tryRefresh(): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  }).then((res) => {
    if (!res.ok) throw new Error('Refresh failed');
  }).finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiFetch<T>(path: string, options?: RequestInit, _retry = true): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
  });

  // Access token expired — try to refresh then retry once
  if (res.status === 401 && _retry && path !== '/api/auth/refresh') {
    try {
      await tryRefresh();
      return apiFetch<T>(path, options, false);
    } catch {
      throw new ApiError(401, 'Session expired', {});
    }
  }

  if (!res.ok) {
    let message = `API error ${res.status}`;
    let body: Record<string, unknown> = {};
    try {
      body = await res.json();
      message = (body.message as string) ?? (body.detail as string) ?? message;
    } catch {}
    throw new ApiError(res.status, message, body);
  }

  if (res.status === 204 || res.headers.get('Content-Length') === '0') {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export { API_URL };
