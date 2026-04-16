import axios from "axios";
import api from "../api";

export async function fetchDrivers() {
    try{
        var response = await api.get("api/driver/all");
        console.log(response.data);
        return response.data;
    } catch(e){
        console.log(e);
    }
}