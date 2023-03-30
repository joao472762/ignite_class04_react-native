import { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {UserDTO} from '@dtos/userDTOS'
import { api } from "@libs/axios";
import { AppError } from "@utils/AppError";
import { getUserInLocalStorage, SaveUserInLocalSotorage, removeUserInLocalStorage } from "@storage/StorageUser";
import { getAuthTokenInLocalStorage, removeTokenInLocalStorage, SaveTokenInLocalStorage } from "@storage/StorageAuthToken";




interface AuthContextType  {
    signOut: () => Promise<void>,
    user: UserDTO ,
    localStorageIsLoading: boolean
    createUser: (user: UserDTO) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>,


}

interface AuthContextProviderProps {
    children: ReactNode,
  
}

interface SeesionData  {
    token: string
    user: UserDTO
}



export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({children }: AuthContextProviderProps){
    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [localStorageIsLoading, setLocalStorageIsLoading] = useState(true)

 

    function userAndTokenUpdate(userData: UserDTO, token: string){
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData)
        
    }
    
    async function storageUserAndTokenSave(userData: UserDTO, token: string){
        try {
            setLocalStorageIsLoading(true)
           

            await SaveUserInLocalSotorage(userData )
            await SaveTokenInLocalStorage(token)
            
        } catch (error) {
            throw error
        }
        finally {
            setLocalStorageIsLoading(false)
        }
    }

    async function signIn(email: string, password: string){
        try {
            const response = await api.post<SeesionData>('/sessions',{
                email,
                password,
            })

            const {user,token} = response.data

            if(!user && !token) return;

            userAndTokenUpdate(user, token)
            await storageUserAndTokenSave(user, token)
            
            
        } catch (error) {
           throw error
        }
    }
    async function signOut(){
        try {
            setLocalStorageIsLoading(true)
            setUser({} as UserDTO)
            await removeUserInLocalStorage()
            await removeTokenInLocalStorage()

        } catch (error) {
            throw error
        }

        finally {
            setLocalStorageIsLoading(false)
        }
    }
    async function createUser(user: UserDTO) {
        setUser(user)
        SaveUserInLocalSotorage(user)
    }

    async function fetchUserDataInLocalStorage(){
        try {
            setLocalStorageIsLoading(true)

            const userResponse = await getUserInLocalStorage()
            const tokenResponse = await getAuthTokenInLocalStorage()
             
            if(!tokenResponse && !userResponse) return;
            
            userAndTokenUpdate(userResponse, tokenResponse as string)

        } catch (error) {
            console.error(error)   
        }
        finally {
            setLocalStorageIsLoading(false)
        }
    }

    useEffect(() => { 
        fetchUserDataInLocalStorage()
    }, [])


    return (
        <AuthContext.Provider value={{ 
            user, 
            localStorageIsLoading, 
            signIn,
            signOut,
            createUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}