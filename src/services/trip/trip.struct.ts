import { Car } from "../car/car.struct";
import { Driver } from "../driver/driver.struct";
import { Order } from "../order/order.struct";

export interface Trip {
    id: number,
    order: Order,
    driver: Driver,
    car: Car,
    finalePrice: number,
    finaleTimeMinutes: number
}