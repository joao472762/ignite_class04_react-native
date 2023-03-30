import { AppRoutes } from './appRoutes'
import { useContext } from 'react'
import { Box, useTheme } from 'native-base'
import {NavigationContainer,DefaultTheme} from '@react-navigation/native'

import { AuthRoutes } from './auth'

import { Loader } from '@components/Loader'

import { useAuth } from '@hooks/useAuth'

export function Router(){
    const {colors} = useTheme()
    const NavigationTheme =  DefaultTheme
    const {user, localStorageIsLoading} = useAuth()
    NavigationTheme.colors.background = colors.gray[700]

    if(localStorageIsLoading){
        return <Loader/>
    }
    
    return (    
        <Box flex={1} backgroundColor='gray.700'>
            <NavigationContainer theme={NavigationTheme}>
                {user.id ?  <AppRoutes/> : <AuthRoutes/>}
            </NavigationContainer>
        </Box>

    )
}