import api from "../api";

export async function login(email: string, password: string) {
    const res = await api.post(
        `/api/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    return res.data;
}

export async function register(email: string, password: string, phone: string) {
    const res = await api.post(
        `/api/auth/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&phone=${encodeURIComponent(phone)}`
    );
    return res.data;
}

export async function logout() {
    await api.post("/api/auth/logout");
}