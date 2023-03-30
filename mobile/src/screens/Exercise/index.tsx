import {  Box, HStack,  Image,  ScrollView,  useToast,  VStack } from "native-base";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { ExerciseHeader } from "./components/ExerciseHeader";

import WeightSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { AppRoutesParamList } from "@routes/appRoutes";
import { useQuery } from "react-query";
import { api } from "@libs/axios";
import { ExerciseDTO } from "@dtos/exerciseDTOS";
import { Loader } from "@components/Loader";
import { AppError } from "@utils/AppError";
import { useState } from "react";

export function Exercise({ route: { params }, navigation}: BottomTabScreenProps<AppRoutesParamList, 'Exercise'>){
    const [exerciseIsRegistering, setExrciseIsRegistering] = useState(false)
    const Toast  = useToast()
    const { data: exercise = {} as ExerciseDTO, isLoading } = useQuery<ExerciseDTO>(['exercise', params.id],async () => {
        try {
            const response = await api.get(`/exercises/${params.id}`)
            return response.data
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'erro no ssevidor , por favor tente mais tarde'
            Toast.show({
                title, 
                backgroundColor: 'red.400'
            })
            return {} as ExerciseDTO
        }
    })

    async function handleExerciseHistoryRegister(){
        try {
            setExrciseIsRegistering(true)
            await api.post('/history', { exercise_id: params })
            
            Toast.show({
                placement: 'top',
                paddingX: 10,
                duration: 2000,
                title: 'Parabéns exercicio registrado com sucesso',
                backgroundColor: 'green.700'
            })
            
            setTimeout(() => {
                navigation.navigate('Home')
            },2000)
        } catch (error) {
            const isAppError = error instanceof AppError
            
            const title = isAppError ? error.message : 'não foi possível registrar o exercício'
            Toast.show({
                title,
                placement: 'top',
                backgroundColor: 'red.400'

            })
        }
        finally {
            setExrciseIsRegistering(false)
        }
    }

    if(isLoading) return <Loader/>;

    return (
        <VStack flex={1}>
            <ExerciseHeader
                exerciseName={exercise.name}
                muscle={exercise.group}
            />
            <ScrollView contentContainerStyle={{flexGrow:1, paddingBottom:10}}>
                <VStack
                    flexGrow={1}
                    padding={8}
                > 
                    <Box
                        rounded='lg'
                        overflow={'hidden'}
                        height={'60%'}
                    >
                        <Image
                            flex={1}
                            alt="Puxada Frontal"
                            source={{
                                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`
                            }}
                            width={'full'}
                         
                            
                            resizeMode="cover"
                        />

                    </Box>
                    <VStack
                        padding={'4'}
                        rounded={'lg'}
                        marginTop={'4'}
                        paddingTop={'5'}
                        justifyContent={'center'}
                        backgroundColor={'gray.600'}
                    >
                        <HStack
                        
                            justifyContent={'space-around'}
                        >
                            
                            <HStack
                                alignItems={'center'}
                            >
                                <WeightSvg/>
                                <Text fontSize={'lg'} color='gray.200' marginLeft={1}>{exercise.series} séries</Text>
                            </HStack>
                            <HStack
                                alignItems={'center'}
                            >
                                <RepetitionsSvg/>
                                <Text fontSize={'lg'} color='gray.200' marginLeft={1}>{exercise.repetitions} repetições</Text>
                            </HStack>
                        </HStack>
                        
                        <Button     
                            onPress={handleExerciseHistoryRegister}
                            isLoading={exerciseIsRegistering}
                            marginTop={4}
                        >
                            Marcar como realizado
                        </Button>
                    </VStack>
                </VStack>

            </ScrollView>
        </VStack>
    )
}