import axios from "axios"

const api = axios.create({
    baseURL: "https://audibly-rummage-survival.ngrok-free.dev",
    withCredentials: true
});

export default api;