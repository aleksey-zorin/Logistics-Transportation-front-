import axios from "axios"

const api = axios.create({
    baseURL: "https://localhost:56782/",
    withCredentials: true
});

export default api;