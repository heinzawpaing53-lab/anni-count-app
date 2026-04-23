export interface AuthUser {
  id: string;
  email: string;
  name: string;
  partnerName: string;
  anniversaryDate: string;
  createdAt: string;
}

export interface MemoryRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  createdAt: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  partnerName: string;
  anniversaryDate: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const TOKEN_KEY = "everlasting_auth_token";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

function buildApiUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

export function getAuthToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  token = getAuthToken()
): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  const payload = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : "Request failed.";
    throw new Error(message);
  }

  return payload as T;
}

export async function register(payload: RegisterPayload) {
  return apiRequest<{ token: string; user: AuthUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload) {
  return apiRequest<{ token: string; user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout(token = getAuthToken()) {
  return apiRequest<{ ok: true }>(
    "/api/auth/logout",
    {
      method: "POST",
    },
    token
  );
}

export async function getCurrentUser(token = getAuthToken()) {
  return apiRequest<{ user: AuthUser }>("/api/auth/me", {}, token);
}

export async function updateProfile(
  updates: Partial<Pick<AuthUser, "name" | "partnerName" | "anniversaryDate">>,
  token = getAuthToken()
) {
  return apiRequest<{ user: AuthUser }>(
    "/api/profile",
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
    token
  );
}

export async function getMemories(token = getAuthToken()) {
  return apiRequest<{ memories: MemoryRecord[] }>("/api/memories", {}, token);
}

export async function createMemory(
  payload: Pick<MemoryRecord, "title" | "description" | "date" | "image">,
  token = getAuthToken()
) {
  return apiRequest<{ memory: MemoryRecord }>(
    "/api/memories",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function deleteMemory(id: string, token = getAuthToken()) {
  return apiRequest<{ ok: true }>(
    `/api/memories/${id}`,
    {
      method: "DELETE",
    },
    token
  );
}

export async function deleteAccount(token = getAuthToken()) {
  return apiRequest<{ ok: true }>(
    "/api/account",
    {
      method: "DELETE",
    },
    token
  );
}
