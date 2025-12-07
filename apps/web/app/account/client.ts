import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});
export const API_BASE = `${process.env.NEXT_PUBLIC_HTTP_SERVER}/api`;

export async function logout() {
    const response = await axiosWithCredentials.post(`${API_BASE}/auth/logout`);
    return response.data;
}

export async function updateCurrentUser(payload: {username?: string; email?: string}) {
    const response = await axiosWithCredentials.patch(`${API_BASE}/users/me`, payload);
    return response.data;
}
