export const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "/api";

const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
};

export async function fetchJson<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
        cache: "no-store", // Disable Next.js caching
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            payload?.error?.message ||
            payload?.message ||
            `Request failed: ${response.status}`;
        throw new Error(message);
    }

    return (payload as T) ?? ({} as T);
}

export async function submitAiReview(form: FormData) {
    const response = await fetch(`${API_BASE}/ai-review`, {
        method: "POST",
        credentials: "include",
        body: form,
    });
    if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "AI review failed");
    }
    return response.json();
}

export async function fetchPosts(params: {
    folder?: string;
    search?: string;
    role?: string;
}) {
    const query = new URLSearchParams();
    if (params.folder) query.set("folder", params.folder);
    if (params.search) query.set("search", params.search);
    if (params.role) query.set("role", params.role);
    return fetchJson(`/posts?${query.toString()}`);
}

export async function createPost(payload: {
    summary: string;
    details: string;
    folders: string[];
    postType?: string;
    visibility?: string;
}) {
    return fetchJson("/posts", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function registerUser(payload: any) {
    return fetchJson("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function loginUser(payload: any) {
    return fetchJson("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function fetchSession() {
    return fetchJson("/auth/session");
}

export async function logoutUser() {
    return fetchJson("/auth/logout", {
        method: "POST",
    });
}

export async function updateCurrentUser(payload: any) {
    return fetchJson("/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}
