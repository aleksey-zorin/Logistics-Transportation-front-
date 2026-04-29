import api from "../api";
import { TripLoader } from "./triploader.struct";

export interface TripLoaderFilter {
    tripId?: number;
    loaderId?: number;
}

export const fetchTripLoaders = (filter?: TripLoaderFilter) =>
    api.get<TripLoader[]>("/api/trip-loader/all", { params: filter }).then(r => r.data);

export const fetchTripLoaderById = (id: number) =>
    api.get<TripLoader>(`/api/trip-loader/${id}`).then(r => r.data);

export const createTripLoader = (data: { tripId: number; loaderId: number }) =>
    api.post<TripLoader>("/api/trip-loader", data).then(r => r.data);

export const updateTripLoader = (id: number, data: { tripId: number; loaderId: number }) =>
    api.put(`/api/trip-loader/${id}`, data).then(r => r.data);

export const deleteTripLoader = (id: number) =>
    api.delete(`/api/trip-loader/${id}`).then(r => r.data);