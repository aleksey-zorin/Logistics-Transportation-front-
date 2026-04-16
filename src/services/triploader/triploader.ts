import api from "../api";

export async function fetchTripLoaders() {
    try{
        var response = await api.get("api/trip-loader/all");

        console.log(response.data);
        return response.data;
    }catch(e){
        console.log(e);
    }
}