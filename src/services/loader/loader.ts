import axios from "axios";
import api from "../api";

export async function fetchLoaders() {
    try {
        var response = await api.get("api/loader/all");
        
        console.log(response.data);
        return response.data;
    } catch(e){
        console.log(e);
    }
}