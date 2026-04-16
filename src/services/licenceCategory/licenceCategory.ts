import axios from "axios";
import api from "../api";

export async function fetchLicenceCategories() {
    try{
        var response = await api.get("api/licence-categories/all");
        console.log(response.data);
        return response.data;
    } catch(e){
        console.log(e);
    }
}