const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

// Default barangay for the landing page (can be overridden via URL or context)
export const DEFAULT_BARANGAY = "binuangan";

const TOKEN_KEY = "brgy_token";
const USER_KEY = "brgy_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): { _id: string; username: string; fullName: string; role: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: { _id: string; username: string; fullName: string; role: string }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

async function request<T>(barangay: string, path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // Let the browser set the multipart boundary for file uploads
  if (options?.body instanceof FormData) delete headers["Content-Type"];
  const url = barangay ? `${API_BASE}/api/${barangay}${path}` : `${API_BASE}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Announcements
  announcements: {
    list: (barangay = DEFAULT_BARANGAY, params?: { page?: number; limit?: number; category?: string; search?: string }) =>
      request<any[]>(barangay, "/announcements" + (params ? "?" + new URLSearchParams(params as any).toString() : "")),
    get: (barangay: string, id: string) => request<any>(barangay, `/announcements/${id}`),
  },

  // Residents
  residents: {
    list: (barangay = DEFAULT_BARANGAY, params?: { page?: number; limit?: number; search?: string; status?: string }) =>
      request<any[]>(barangay, "/residents" + (params ? "?" + new URLSearchParams(params as any).toString() : "")),
    get: (barangay: string, id: string) => request<any>(barangay, `/residents/${id}`),
  },

  // Cases
  cases: {
    list: (barangay = DEFAULT_BARANGAY, params?: { page?: number; limit?: number; status?: string; search?: string }) =>
      request<any[]>(barangay, "/cases" + (params ? "?" + new URLSearchParams(params as any).toString() : "")),
    get: (barangay: string, id: string) => request<any>(barangay, `/cases/${id}`),
  },

  // Hearings
  hearings: {
    list: (barangay = DEFAULT_BARANGAY, params?: { page?: number; limit?: number; status?: string; case_id?: string }) =>
      request<any[]>(barangay, "/hearings" + (params ? "?" + new URLSearchParams(params as any).toString() : "")),
    get: (barangay: string, id: string) => request<any>(barangay, `/hearings/${id}`),
  },

  // Crime reports
  crimeReports: {
    list: (barangay = DEFAULT_BARANGAY, params?: { page?: number; limit?: number; status?: string; incident_type?: string; search?: string }) =>
      request<any[]>(barangay, "/crime-reports" + (params ? "?" + new URLSearchParams(params as any).toString() : "")),
    get: (barangay: string, id: string) => request<any>(barangay, `/crime-reports/${id}`),
  },

  // Wanted persons
  wantedPersons: {
    list: (barangay = DEFAULT_BARANGAY, params?: { page?: number; limit?: number; status?: string; search?: string }) =>
      request<any[]>(barangay, "/wanted-persons" + (params ? "?" + new URLSearchParams(params as any).toString() : "")),
    get: (barangay: string, id: string) => request<any>(barangay, `/wanted-persons/${id}`),
  },

  // Lost & Found
  lostFound: {
    list: (barangay = DEFAULT_BARANGAY, params?: { page?: number; limit?: number; type?: string; status?: string; search?: string }) =>
      request<any[]>(barangay, "/lost-found" + (params ? "?" + new URLSearchParams(params as any).toString() : "")),
    get: (barangay: string, id: string) => request<any>(barangay, `/lost-found/${id}`),
  },

  // Documents
  documents: {
    list: (barangay = DEFAULT_BARANGAY, params?: { entity_type?: string; entity_id?: string; doc_type?: string }) =>
      request<any[]>(barangay, "/documents" + (params ? "?" + new URLSearchParams(params as any).toString() : "")),
    upload: (barangay: string, file: File, metadata: any) => {
      const form = new FormData();
      form.append("file", file);
      return request<any>(barangay, "/documents/upload", {
        method: "POST",
        body: form,
        headers: {}, // Let browser set Content-Type for multipart
      });
    },
    register: (barangay: string, data: {
      file_id: string; file_name: string; mime_type: string; file_size: number;
      title?: string; description?: string; doc_type?: string;
      entity_type?: string | null; entity_id?: string | null; is_public?: boolean;
    }) =>
      request<any>(barangay, "/documents", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    remove: (barangay: string, id: string) =>
      request<{ deleted: boolean }>(barangay, `/documents/${id}`, { method: "DELETE" }),
    download: (barangay: string, id: string) => `${API_BASE}/api/${barangay}/documents/${id}`,
  },

  // PNP / office document requests (CFA queue)
  documentRequests: {
    list: (barangay = DEFAULT_BARANGAY, params?: { status?: string; search?: string; page?: number; limit?: number }) =>
      request<any[]>(barangay, "/document-requests" + (params ? "?" + new URLSearchParams(params as any).toString() : "")),
    create: (barangay: string, data: { request_code: string; requesting_office: string; purpose: string }) =>
      request<any>(barangay, "/document-requests", { method: "POST", body: JSON.stringify(data) }),
    update: (barangay: string, id: string, data: Record<string, unknown>) =>
      request<any>(barangay, `/document-requests/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (barangay: string, id: string) =>
      request<{ deleted: boolean }>(barangay, `/document-requests/${id}`, { method: "DELETE" }),
  },

  // Generic CRUD used by the admin record tables
  create: (barangay: string, resource: string, data: Record<string, unknown>) =>
    request<any>(barangay, `/${resource}`, { method: "POST", body: JSON.stringify(data) }),
  update: (barangay: string, resource: string, id: string, data: Record<string, unknown>) =>
    request<any>(barangay, `/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (barangay: string, resource: string, id: string) =>
    request<{ deleted: boolean }>(barangay, `/${resource}/${id}`, { method: "DELETE" }),

  // Barangays list
  barangays: {
    list: () => request<any[]>("", "/barangays"),
  },

  // Auth
  auth: {
    login: (username: string, password: string) =>
      request<{ token: string; user: any }>("", "/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
    bootstrap: (data: { username: string; password: string; fullName?: string }) =>
      request<any>("", "/auth/bootstrap", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};