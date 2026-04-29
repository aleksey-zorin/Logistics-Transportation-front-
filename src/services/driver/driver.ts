import api from "../api";
import { Driver } from "./driver.struct";

export interface DriverFilter {
    name?: string;
    passport?: string;
    minAge?: number;
    maxAge?: number;
    minRate?: number;
    maxRate?: number;
    licenceCategory?: string;
}

export const fetchDrivers = (filter?: DriverFilter) =>
    api.get<Driver[]>("/api/driver/all", { params: filter }).then(r => r.data);

export const fetchDriverById = (id: number) =>
    api.get<Driver>(`/api/driver/${id}`).then(r => r.data);

export const createDriver = (data: Omit<Driver, "id">) =>
    api.post<Driver>("/api/driver", data).then(r => r.data);

export const updateDriver = (id: number, data: Omit<Driver, "id">) =>
    api.put(`/api/driver/${id}`, data).then(r => r.data);

export const deleteDriver = (id: number) =>
    api.delete(`/api/driver/${id}`).then(r => r.data);