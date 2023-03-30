import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import {  HStack, Icon,  Image, useTheme, VStack, } from "native-base";
import {useNavigation} from '@react-navigation/native'

import { Text } from "@components/Text";
import { Heading } from "@components/Heading";
import { ExerciseDTO } from '@dtos/exerciseDTOS';
import { api } from '@libs/axios';
import {AppRouterNavigatorRoutesProps} from '@routes/appRoutes'

interface CardProps extends TouchableOpacityProps {
    exercise: ExerciseDTO
}
export function Card({ exercise, ...rest }: CardProps) {
    const { colors, sizes } = useTheme()

    
    
    return (
        <TouchableOpacity
            {...rest}
        >
            <HStack
                backgroundColor={ colors.gray[500]}
                rounded={'md'}
                marginBottom={3}
                padding={2}
                paddingRight={4}
                alignItems={ 'center'}
                
            >
                <Image
                    width={"16"}
                    height={"16"}
                    resizeMode='cover'
                    rounded={'md'}
                    alt={ exercise.name }

                    source={{uri: `${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}`}}
                />
                <VStack flex={1} justifyContent='center' paddingLeft={4}>
                    <Heading color={'white'} fontSize='lg'>{ exercise.name }</Heading>
                    <Text numberOfLines={2} color={'gray.200'} fontSize='sm'>
                        {exercise.series} séries de {exercise.repetitions} repetições
                    </Text>
                </VStack>

                <Icon
                lineHeight={ 0}
                    as={Entypo}
                name={ 'chevron-thin-right'}
                size={ 'md'}
                color={ 'gray.300'}
                />
            

            </HStack>
        </TouchableOpacity>
    )
}        
