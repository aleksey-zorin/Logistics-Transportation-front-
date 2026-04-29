import api from "../api";
import { Order } from "./order.struct";

export interface OrderFilter {
    email?: string;
    pickAppAdress?: string;
    deliveryAdress?: string;
    description?: string;
    dateFrom?: string;
    dateTo?: string;
    minWeight?: number;
    maxWeight?: number;
    minVolume?: number;
    maxVolume?: number;
}

export const fetchOrders = (filter?: OrderFilter) =>
    api.get<Order[]>("/api/order/all-orders", { params: filter }).then(r => r.data);

export const fetchOrderById = (id: number) =>
    api.get<Order>(`/api/order/${id}`).then(r => r.data);

export const fetchClientOrders = (filter?: Omit<OrderFilter, "email">) =>
    api.get<Order[]>("/api/order/all-client-orders", { params: filter }).then(r => r.data);

export const createOrder = (data: {
    pickAppAddress: string;
    deliveryAddress: string;
    description: string;
    cargoWeight: number;
    cargoVolume: number;
}) => api.post("/api/order", data).then(r => r.data);

export const updateOrder = (id: number, data: Omit<Order, "id" | "userId" | "registrationDateOrder">) =>
    api.put(`/api/order/${id}`, data).then(r => r.data);

export const deleteOrder = (id: number) =>
    api.delete(`/api/order/${id}`).then(r => r.data);