import axios from "axios"
import api from "../api";

import { Order } from "./order.struct";

export async function fetchOrders() {
    try {
        var response = await api.get("api/order/all-orders");
        
        return response.data;
    } catch(e) {
         console.log(e);
    }
}   