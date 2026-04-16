import axios from "axios";
import api from "../api";

export async function fetchTrips() {
    try {
        var response = await api.get("api/trip/all");
        
        console.log(response.data);
        return response.data;
    } catch(e) {
         console.log(e);
    }
}   