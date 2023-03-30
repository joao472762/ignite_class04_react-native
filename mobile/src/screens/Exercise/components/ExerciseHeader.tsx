import { Feather } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {  HStack, IconButton, useTheme, VStack } from "native-base";

import { Heading } from "@components/Heading";
import { Text } from "@components/Text";

import BodySvg from '@assets/body.svg'
import { AppRouterNavigatorRoutesProps } from "@routes/appRoutes";

interface ExerciseHaderProps  {
    exerciseName: string,
    muscle: string,
}

export function ExerciseHeader({ exerciseName, muscle}: ExerciseHaderProps){
    const {colors} = useTheme()
    const { navigate } = useNavigation<AppRouterNavigatorRoutesProps>()

    function handleNavigateToHomeScreen(){
       navigate('Home')
    }

    return (
        <SafeAreaView
            style={{ backgroundColor: colors.gray[600] }}
        >
            <VStack
                
                paddingX={8}
                paddingTop={"4"}
                paddingBottom={6}
                alignItems='flex-start'

            >
                <IconButton
                    maxWidth={5}
                    maxHeight={5}
                    onPress={handleNavigateToHomeScreen}
                    _icon={{
                        as: Feather,
                        name: 'arrow-left',
                        size: 'xl',
                        color: 'green.500'
                    }}
                />
                <HStack
                    width='full'
                    marginTop={5}
                    justifyContent={'space-between'}
                >
                    <Heading flexShrink={1} color={'gray.100'}>{exerciseName}</Heading>

                    <HStack alignItems={'center'}>
                        <BodySvg />
                        <Text 
                            marginLeft={'px'} 
                            color='gray.200' 
                            alignItems={'center'}
                            textTransform={'capitalize'}
                        >
                            {muscle}
                        </Text>
                    </HStack>
                </HStack>

            </VStack>
        </SafeAreaView>

    )
}