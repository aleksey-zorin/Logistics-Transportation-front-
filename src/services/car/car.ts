import api from "../api";
import { Car } from "./car.struct";

export interface CarFilter {
    carMake?: string;
    carModel?: string;
    typeOfCar?: string;
    carNumber?: string;
    minCargoCapacityT?: number;
    maxCargoCapacityT?: number;
    minTrunkVolumeT?: number;
    maxTrunkVolumeL?: number;
    minFuelConsumption?: number;
    maxFuelConsumption?: number;
    licenceCategory?: string;
}

export const fetchCars = (filter?: CarFilter) =>
    api.get<Car[]>("/api/car/all", { params: filter }).then(r => r.data);

export const fetchCarById = (id: number) =>
    api.get<Car>(`/api/car/${id}`).then(r => r.data);

export const createCar = (data: Omit<Car, "id">) =>
    api.post<Car>("/api/car", data).then(r => r.data);

export const updateCar = (id: number, data: Omit<Car, "id">) =>
    api.put(`/api/car/${id}`, data).then(r => r.data);

export const deleteCar = (id: number) =>
    api.delete(`/api/car/${id}`).then(r => r.data);