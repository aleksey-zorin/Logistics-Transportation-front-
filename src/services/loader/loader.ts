import api from "../api";
import { Loader } from "./loader.struct";

export interface LoaderFilter {
    name?: string;
    passport?: string;
    minAge?: number;
    maxAge?: number;
}

export const fetchLoaders = (filter?: LoaderFilter) =>
    api.get<Loader[]>("/api/loader/all", { params: filter }).then(r => r.data);

export const fetchLoaderById = (id: number) =>
    api.get<Loader>(`/api/loader/${id}`).then(r => r.data);

export const createLoader = (data: Omit<Loader, "id">) =>
    api.post<Loader>("/api/loader", data).then(r => r.data);

export const updateLoader = (id: number, data: Omit<Loader, "id">) =>
    api.put(`/api/loader/${id}`, data).then(r => r.data);

export const deleteLoader = (id: number) =>
    api.delete(`/api/loader/${id}`).then(r => r.data);