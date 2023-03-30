import { useTheme } from 'native-base'
import { Platform } from 'react-native'
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import { Home } from '@screens/Home'
import { Profile } from '@screens/Profile'
import { History } from '@screens/History/index'
import { Exercise } from '@screens/Exercise/index'

import HomeSvg from '@assets/home.svg'
import ProfileSvg from '@assets/profile.svg'
import HistorySvg from '@assets/history.svg'

export type AppRoutesParamList = {
    Home: undefined,
    Exercise: {id:string | number},
    History: undefined,
    Profile: undefined,
}

export type AppRouterNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesParamList>

const {Navigator, Screen} = createBottomTabNavigator<AppRoutesParamList>()

export function AppRoutes(){
    const {colors, sizes} = useTheme()
    const iconSize= sizes[6]
    return (

    <Navigator
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.green[500],
            tabBarInactiveTintColor: colors.gray[200],

            
            tabBarStyle: {
                borderTopWidth: 0,
                backgroundColor: colors.gray[600],
                height: Platform.OS === 'android' ? 'auto' : 96,
                paddingBottom: sizes[12],
                paddingTop: sizes[6]

            },

            tabBarItemStyle: {
                height: iconSize,
                width: iconSize,
            }
            
        }}

        
    >
        <Screen 
            name='Home' 
            component={Home}
            options= {{
                tabBarIcon:  ({color,size}) => (
                    <HomeSvg fill={color} width={size} height={size} />

                )
            }}
        />
        <Screen 
            name='History' 
            component={History}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <HistorySvg fill={color} width={size} height={size} />

                )
            }}
        />
        <Screen 
            name='Profile' 
            component={Profile}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <ProfileSvg fill={color} width={size} height={size} />

                )
            }}
        />
        <Screen 
            name='Exercise' 
            component={Exercise}
            options= {{
                tabBarButton: () => null
            }}
           
        />
    </Navigator>
    )
}