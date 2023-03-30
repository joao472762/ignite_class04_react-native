import { UserDTO } from "@dtos/userDTOS"
import AsyncStorage from "@react-native-async-storage/async-storage"
    import { STORAGE_USER_KEY } from "."

export async function SaveUserInLocalSotorage(user: UserDTO){
    try {
        const userInStringfly =  JSON.stringify(user)
        await AsyncStorage.setItem(STORAGE_USER_KEY, userInStringfly)
    } catch (error) {
       throw error
    }
}


export async function getUserInLocalStorage(){
        try {
         
            const localStorageResponse = await AsyncStorage.getItem(STORAGE_USER_KEY)

            const userLogged : UserDTO = localStorageResponse ? JSON.parse(localStorageResponse) : {}

            return userLogged

        } catch (error) {
           throw error
        }

}

export async function  removeUserInLocalStorage(){
    try {
        await AsyncStorage.removeItem(STORAGE_USER_KEY)
    } catch (error) {
        throw error
    }
}