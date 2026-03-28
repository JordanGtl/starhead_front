const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

export const TOKEN_KEY = 'sh_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

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

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    let body: Record<string, unknown> = {};
    try {
      body = await res.json();
      message = (body.message as string) ?? (body.detail as string) ?? message;
    } catch {}
    throw new ApiError(res.status, message, body);
  }

  return res.json() as Promise<T>;
}

export { API_URL };
