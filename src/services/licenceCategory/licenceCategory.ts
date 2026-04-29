import api from "../api";
import { licenceCategories } from "./licenceCategory.struct";

export const fetchLicenceCategories = (licenceName?: string) =>
    api.get<licenceCategories[]>("/api/licence-categories/all", {
        params: licenceName ? { licenceName } : undefined
    }).then(r => r.data);

export const fetchLicenceCategoryById = (id: number) =>
    api.get<licenceCategories>(`/api/licence-categories/${id}`).then(r => r.data);

export const createLicenceCategory = (name: string) =>
    api.post<licenceCategories>("/api/licence-categories", { name }).then(r => r.data);

export const updateLicenceCategory = (id: number, name: string) =>
    api.put(`/api/licence-categories/${id}`, { name }).then(r => r.data);

export const deleteLicenceCategory = (id: number) =>
    api.delete(`/api/licence-categories/${id}`).then(r => r.data);