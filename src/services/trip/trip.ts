import api from "../api";
import { Trip } from "./trip.struct";

export interface TripFilter {
    orderId?: number;
    driverId?: number;
    carId?: number;
    minFinalePrice?: number;
    maxFinalePrice?: number;
    minFinaleTimeMinutes?: number;
    maxFinaleTimeMinutes?: number;
}

export const fetchTrips = (filter?: TripFilter) =>
    api.get<Trip[]>("/api/trip/all", { params: filter }).then(r => r.data);

export const fetchTripById = (id: number) =>
    api.get<Trip>(`/api/trip/${id}`).then(r => r.data);

export const fetchClientTrips = (filter?: TripFilter) =>
    api.get<Trip[]>("/api/trip/all-client-trips", { params: filter }).then(r => r.data);

export const createTrip = (data: {
    orderId: number;
    driverId: number;
    carId: number;
    finalePrice: number;
    finalTimeMinutes: number;
}) => api.post<Trip>("/api/trip", data).then(r => r.data);

export const updateTrip = (id: number, data: {
    driverId: number;
    carId: number;
    finalePrice: number;
    finalTimeMinutes: number;
}) => api.put(`/api/trip/${id}`, data).then(r => r.data);

export const deleteTrip = (id: number) =>
    api.delete(`/api/trip/${id}`).then(r => r.data);