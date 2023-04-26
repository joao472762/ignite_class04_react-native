import axios, { AxiosError, AxiosInstance } from "axios";

import { AppError } from "@utils/AppError";
import { SaveTokensInLocalStorage,getAuthTokensInLocalStorage } from "@storage/StorageAuthToken";

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
  baseURL: 'http://192.168.0.2',
  timeout: 5000,
}) as APIInstanceProps;

let failedQueued: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = singOut => {
  const interceptTokenManager = api.interceptors.response.use((response) => response, async (requestError) => {
    if(requestError.response?.status === 401) {
      if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
        const { refresh_token } = await getAuthTokensInLocalStorage();

        if(!refresh_token) {
          singOut();
          return Promise.reject(requestError)
        }
        
        const originalRequestConfig = requestError.config;

        if(isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueued.push({
              onSuccess: (token: string) => { 
                originalRequestConfig.headers = { 'Authorization': `Bearer ${token}` };
                resolve(api(originalRequestConfig));
              },
              onFailure: (error: AxiosError) => {
                reject(error)
              },
            })
          })
        }

        isRefreshing = true

        return new Promise(async (resolve, reject) => {
          try {
            const { data } = await api.post('/sessions/refresh-token', { refresh_token });
            await SaveTokensInLocalStorage({ token: data.token, refresh_token: data.refresh_token });

            if(originalRequestConfig.data) {
              originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
            }

            originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` };
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            failedQueued.forEach(request => {
              request.onSuccess(data.token);
            });

            console.log("TOKEN ATUALIZADO");

            resolve(api(originalRequestConfig));
          } catch (error: any) {
            console.log(error)
            failedQueued.forEach(request => {
              request.onFailure(error);
            })

            singOut();
            reject(error);
          } finally {
            isRefreshing = false;
            failedQueued = []
          }
        })

      }
      
      singOut();
      
    }

    if(requestError.response && requestError.response.data) {
      return Promise.reject(new AppError(requestError.response.data.message))
    } else {
      return Promise.reject(requestError)
    }
  });

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  }
}



export { api };

// import { getAuthTokensInLocalStorage } from "@storage/StorageAuthToken";
// import { AppError } from "@utils/AppError";
// import axios, {AxiosInstance} from "axios";

// type signOut = () => void

// interface PromiseType {
//     onSuccess: (token: string) => void,
//     onFailuere: (error: AxiosErros) => void

// }
// interface ApiInstacePorps extends AxiosInstance {
//     registerInterceptTokenMenager: (signOut: signOut) => () => void
// }

// let faliedQueue : PromiseType[] = []
// let isRefreshing = false
// export interface AxiosErros  {
//     message: string, 
// }

// const api = axios.create({
//     baseURL: 'http://192.168.0.12:3333',
// }) as ApiInstacePorps

// api.registerInterceptTokenMenager = signOut => {
    
//     const InterceptTokenMenager = api.interceptors.response.use(response => response, async (requestError) => {

//     if(requestError?.response?.status === 401 ){
//         if(
//             requestError.response.data?.message === 'token.expired' ||
//             requestError.response.data?.message === 'token.invalid'
//         ){
//             const {refresh_token} =  await getAuthTokensInLocalStorage() 
//             if(!refresh_token){
//                 signOut()
//                 return Promise.reject(requestError)
//             }

//             const originalRequestConfig = requestError.config

//             if(isRefreshing){
//                 return new Promise((resoleve,reject) => {
//                     faliedQueue.push({
//                         onSuccess: (token: string) => {
//                             originalRequestConfig.headers = {'Authorization': `Bearer ${token}`}
//                             resoleve(api(originalRequestConfig))
//                         },    
//                         onFailuere: (error: AxiosErros) => {
//                             reject(error)
//                         }
//                     })
//                 })
//             }
//             isRefreshing = true

//             return new Promise(async (resoleve,reject) => {
//                 try {
//                     const {data}  = await api.post('/sessions/refresh_token',{refresh_token})
//                     console.log(data)
//                 } catch (error: any) {
//                     faliedQueue.forEach(request => {
//                         request.onFailuere(error)
//                     })
//                     signOut()
//                     reject(error)
//                 } 
//                 finally {
//                     isRefreshing= false
//                     faliedQueue = []
//                 }
//             })
//         }
//         signOut()
//     }


//     if(axios.isAxiosError<AxiosErros>(requestError) && requestError.response && requestError.response.data) {
//         return Promise.reject(new  AppError(requestError.response.data.message))
        
//     }
//     return Promise.reject(requestError)
//     })

//     return () => {
//         api.interceptors.response.eject(InterceptTokenMenager)
//     }
// }




// export {api}

