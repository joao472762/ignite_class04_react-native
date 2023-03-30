import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.0.12:3333',
})

export interface AxiosErros  {
  
    message: string,
    
    
}

api.interceptors.response.use(response => response, (error) => {
    if(axios.isAxiosError<AxiosErros>(error) && error.response && error.response.data) {
        return Promise.reject(new  AppError(error.response.data.message))
        
    }
    return Promise.reject(error)
})

export {api}

