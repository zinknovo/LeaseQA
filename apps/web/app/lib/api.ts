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
    audience?: string;
}) {
    const query = new URLSearchParams();
    if (params.folder) query.set("folder", params.folder);
    if (params.search) query.set("search", params.search);
    if (params.role) query.set("role", params.role);
    if (params.audience) query.set("audience", params.audience);
    return fetchJson(`/posts?${query.toString()}`);
}

export async function createPost(payload: {
    summary: string;
    details: string;
    folders: string[];
    postType?: string;
    visibility?: string;
    audience?: string;
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

export async function uploadPostAttachments(postId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(`${API_BASE}/posts/${postId}/attachments`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error?.message || "Upload failed");
    }
    return response.json();
}

export async function updatePost(postId: string, payload: any) {
    return fetchJson(`/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deletePost(postId: string) {
    return fetchJson(`/posts/${postId}`, {method: "DELETE"});
}

export async function createAnswer(payload: {postId: string; content: string; answerType: string}) {
    return fetchJson("/answers", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateAnswer(answerId: string, payload: any) {
    return fetchJson(`/answers/${answerId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteAnswer(answerId: string) {
    return fetchJson(`/answers/${answerId}`, {method: "DELETE"});
}

export async function createDiscussion(payload: {postId: string; parentId?: string | null; content: string}) {
    return fetchJson("/discussions", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateDiscussion(discussionId: string, payload: any) {
    return fetchJson(`/discussions/${discussionId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export async function deleteDiscussion(discussionId: string) {
    return fetchJson(`/discussions/${discussionId}`, {method: "DELETE"});
}

export async function fetchFoldersApi() {
    return fetchJson("/folders");
}

export async function createFolder(payload: {name: string; displayName: string; description?: string; color?: string}) {
    return fetchJson("/folders", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateFolder(folderId: string, payload: {name?: string; displayName?: string; description?: string; color?: string}) {
    return fetchJson(`/folders/${folderId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteFolder(folderId: string) {
    return fetchJson(`/folders/${folderId}`, {method: "DELETE"});
}
