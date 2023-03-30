import {createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack'
import { SignIn } from '@screens/SignIn'
import { SignUp } from '@screens/SignUp'

export type AuthRoutesParamList = {
    SignIn: undefined,
    SignUp: undefined,
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutesParamList>



const {Navigator, Screen} = createNativeStackNavigator<AuthRoutesParamList>()

export function AuthRoutes(){
    return (
        <Navigator 
            initialRouteName='SignIn'

            screenOptions={{
                animation:'fade',
                headerShown:false,
            }}
        >
            <Screen
                name='SignIn'
                component={SignIn}
            />
            <Screen
                name='SignUp'
                component={SignUp}
            /> 
        </Navigator>
    )
}