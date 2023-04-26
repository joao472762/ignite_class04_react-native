import AsyncStorage from "@react-native-async-storage/async-storage"
import { AppError } from "@utils/AppError"
import { STORAGE_TOKEN_KEY } from "."
import { AuthTokens } from "@dtos/authTokensDTO"



export async function SaveTokensInLocalStorage({refresh_token,token}: AuthTokens) {
    const authTokensInLocalStorage = JSON.stringify({token,refresh_token})
    await AsyncStorage.setItem(STORAGE_TOKEN_KEY, authTokensInLocalStorage)
}

export async function getAuthTokensInLocalStorage(){
    const authTokensResponse = await AsyncStorage.getItem(STORAGE_TOKEN_KEY)
    const authTokens: AuthTokens = authTokensResponse ? JSON.parse(authTokensResponse) : {}

    return authTokens as AuthTokens

}

export async function removeTokenInLocalStorage(){
    await AsyncStorage.removeItem(STORAGE_TOKEN_KEY)
}
