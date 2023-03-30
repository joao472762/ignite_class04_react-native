import { Text } from "@components/Text";
import { useNavigation } from "@react-navigation/native";
import { AppRouterNavigatorRoutesProps } from "@routes/appRoutes";
import { Center, HStack, Pressable, VStack ,Button} from "native-base";

export function HistoryListEmpty(){
    const {navigate} = useNavigation<AppRouterNavigatorRoutesProps>()

    function handleNavigateToHomeScreen(){
        navigate('Home')
    }

    return (
        <Center flex={1}>
       
                <Text color={'white'} fontSize={'xl'}>
                    Não há exercicios registrados ainda
                    
                </Text>
                
                <Pressable
                
                    hitSlop={{
                        bottom: 50
                    }}
                    onPress={handleNavigateToHomeScreen}
                    _pressed={{
                        opacity: .7
                    }}
                    mt={1}
                >
                <Text fontSize={'lg'} color={'green.500'} textDecorationLine={'underline'}>vamos fazer exercícios hoje? </Text>
                </Pressable>

          
            
        </Center>
    )
}