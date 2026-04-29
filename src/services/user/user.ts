import api from "../api";
import { User } from "./user.struct";

export const fetchUsers = (email?: string, phone?: string) =>
    api.get<User[]>("/api/users/all", {
        params: { email, phone }
    }).then(r => r.data);

export const fetchUserById = (id: string) =>
    api.get<User>(`/api/users/${id}`).then(r => r.data);

export const fetchClientProfile = () =>
    api.get<User>("/api/users/client-profile").then(r => r.data);

export const deleteUser = (id: string) =>
    api.delete(`/api/users/${id}`).then(r => r.data);