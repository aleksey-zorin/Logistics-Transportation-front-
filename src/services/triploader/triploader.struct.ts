import { Loader } from "../loader/loader.struct";
import { Trip } from "../trip/trip.struct";

export interface TripLoader {
    id: number,
    trip: Trip,
    loader: Loader
}