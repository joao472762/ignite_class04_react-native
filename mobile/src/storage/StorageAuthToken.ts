import AsyncStorage from "@react-native-async-storage/async-storage"
import { AppError } from "@utils/AppError"
import { STORAGE_TOKEN_KEY } from "."

export async function SaveTokenInLocalStorage(token:string) {
    await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token)
}

export async function getAuthTokenInLocalStorage(){
    const token = await AsyncStorage.getItem(STORAGE_TOKEN_KEY)
    return token

}

export async function removeTokenInLocalStorage(){
    await AsyncStorage.removeItem(STORAGE_TOKEN_KEY)
}
