import axios from "axios";
const api = axios.create({
    baseURL : 'http://localhost:5000/api/v1',
});

//Attach the jwt token to every request automatically, if we have one saved
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.header.Authorization = 'Bearer ${token}';
    }
    return config;
});
 export default api;
