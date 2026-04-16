import api from "../api";

export async function fetchCars() {
    try{
        var response = await api.get("api/car/all")

        console.log(response.data);
        return response.data;
    } catch(e){
        console.log(e);
    }
}