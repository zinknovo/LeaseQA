import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
export const FOLDER_API = `${HTTP_SERVER}/api/folders`;
export const POST_API = `${HTTP_SERVER}/api/posts`;
export const STATS_API = `${HTTP_SERVER}/api/stats`;

export const fetchFolders = async () => {
    const response = await axiosWithCredentials.get(FOLDER_API);
    return response.data;
};

export const fetchPosts = async (filters: { folder?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters.folder) params.append("folder", filters.folder);
    if (filters.search) params.append("search", filters.search);

    const url = params.toString() ? `${POST_API}?${params.toString()}` : POST_API;
    const response = await axiosWithCredentials.get(url);
    return response.data;
};

export const fetchPostById = async (postId: string) => {
    const response = await axiosWithCredentials.get(`${POST_API}/${postId}`);
    return response.data;
};

export const fetchStats = async () => {
    const response = await axiosWithCredentials.get(`${STATS_API}/overview`);
    return response.data;
};