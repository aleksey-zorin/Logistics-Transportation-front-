import api from "./api";

/* ================= GET ================= */

export async function getAll<T>(url: string): Promise<T> {
    const response = await api.get(url);
    return response.data;
}

/* ================= GETBYID ================= */

export async function getById<T>(url: string, id: number): Promise<T[]> {
    const response = await api.get(`${url}/${id}`);
    return response.data;
}

/* ================= GETBYIDUSER ================= */

export async function getByIdUser<T>(url: string, id: string): Promise<T[]> {
    const response = await api.get(`${url}/${id}`);
    return response.data;
}

/* ================= POST ================= */

export async function createItem<T>(url: string, data: any): Promise<T> {
    const response = await api.post(url, data);
    return response.data;
}

/* ================= PUT ================= */

export async function updateItem<T>(url: string, id: number, data: any): Promise<T> {
    const response = await api.put(`${url}/${id}`, data);
    return response.data;
}

/* ================= DELETE ================= */

export async function deleteItem(url: string, id: number) {
    await api.delete(`${url}/${id}`);
}