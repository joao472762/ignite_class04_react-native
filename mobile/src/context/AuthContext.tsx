import { createContext, ReactNode, useEffect, useState } from "react";

import {UserDTO} from '@dtos/userDTOS'
import { api } from "@libs/axios";

import { getUserInLocalStorage, SaveUserInLocalSotorage, removeUserInLocalStorage } from "@storage/StorageUser";
import { getAuthTokensInLocalStorage, removeTokenInLocalStorage, SaveTokensInLocalStorage } from "@storage/StorageAuthToken";
import { AuthTokens } from "@dtos/authTokensDTO";




interface AuthContextType  {
    signOut: () => Promise<void>,
    user: UserDTO ,
    localStorageIsLoading: boolean
    upadateUserProfile: (userData: UserDTO) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>,


}

interface AuthContextProviderProps {
    children: ReactNode,
  
}

interface SeesionData  {
    token: string
    refresh_token: string
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

    async function upadateUserProfile(userData: UserDTO) {
        setUser(userData)
        await SaveUserInLocalSotorage(userData)
    }
    
    async function storageUserAndTokensSave(userData: UserDTO, authTokens: AuthTokens){
        try {
            setLocalStorageIsLoading(true)
           

            await SaveUserInLocalSotorage(userData )
            await SaveTokensInLocalStorage(authTokens)
            
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

            const { user, token, refresh_token} = response.data

            if (!user && !token && !refresh_token) return;

            userAndTokenUpdate(user, token)
            await storageUserAndTokensSave(user, { refresh_token, token })
            
            
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
    
    async function fetchUserDataInLocalStorage(){
        try {
            setLocalStorageIsLoading(true)

            const userResponse = await getUserInLocalStorage()
            const tokensResponse = await getAuthTokensInLocalStorage()
              
            if (!tokensResponse.refresh_token &&  !tokensResponse.refresh_token && !userResponse) return;
            const { refresh_token, token} = tokensResponse
            
            userAndTokenUpdate(userResponse, token)

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

    useEffect(() => {
        const subscribe = api.registerInterceptTokenManager(signOut)
        return () => {
            subscribe()
        }
    }, [signOut])


    return (
        <AuthContext.Provider value={{ 
            user, 
            localStorageIsLoading, 
            signIn,
            upadateUserProfile,
            signOut,
            
        }}>
            {children}
        </AuthContext.Provider>
    )
}