import { useState } from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {  FlatList, HStack, Skeleton, useToast, VStack } from "native-base";

import { Text } from "@components/Text";
import { Card } from "./components/Card";
import { Heading } from "@components/Heading";
import { MuscleGroup } from "./components/MuscleGroup";

import { AppRoutesParamList } from "@routes/appRoutes";
import { HomeHeader } from "@screens/Home/components/HomeHeader";
import { useAuth } from "@hooks/useAuth";
import { string } from "zod";
import { useQuery } from "react-query";
import { api } from "@libs/axios";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/exerciseDTOS";
import { Loader } from "@components/Loader";
import { ExercisesSkeleton } from "./components/ExercisesSkeleton";


type muscleGroupsProps   = string[]

export function Home(route: BottomTabScreenProps<AppRoutesParamList, 'Home'>){
    const {user} = useAuth()
    const Toast = useToast()


    const [muscleGroupSelected, setMuscleGroupSelected] = useState <string | undefined>()

    function handleSelectMuscle(muscleGroup: string){
        setMuscleGroupSelected(muscleGroup)
    }


    function handleNavigateToExerciseScreen(exerciseId: number){
        route.navigation.navigate('Exercise', { id: exerciseId })
    }

    const { data: muscleGroups = []} = useQuery<muscleGroupsProps>('muscleGroups', async () => {
        try {
            const response = await api.get<muscleGroupsProps>('/groups')
            setMuscleGroupSelected(response.data[0])
            return response.data
            
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Não foi possível carregar os grupos muculares'
            Toast.show({
                title,
                backgroundColor: 'red.400',
                paddingX: 20,
                placement: 'top'
            })
            return []
        }
    })

    const { data: exercises = [], isLoading:exercisesIsLoading} = useQuery<ExerciseDTO[]>(['exercises/bygroup',muscleGroupSelected],async () => {
        const response = await api.get<ExerciseDTO[]>(`exercises/bygroup/${muscleGroupSelected}`)
        if(!response) return [];
        return response.data
    },{enabled: !!muscleGroupSelected})

   

    
  
    return (
        <VStack flex={1}>
            <HomeHeader
                avatarUrl={`${api.defaults.baseURL}/avatar/${user.avatar}`}
                greeting={'Olá'}
                userName={user?.name }
            />
            <VStack 
                paddingX={'8'} 
                marginTop={10}
                >
                <FlatList
                    maxHeight={12}
                    minHeight={10}
                    data={muscleGroups}
                    keyExtractor={item => item}
                    horizontal
                    showsVerticalScrollIndicator={false}
                    renderItem={({item:muscleGroup}) => (
                        <MuscleGroup 
                            isSelected={!!muscleGroupSelected  && muscleGroupSelected.toLocaleLowerCase() === muscleGroup.toLocaleLowerCase()}
                            onPress={() => handleSelectMuscle(muscleGroup)}
                            key={muscleGroup}
                        >
                            {muscleGroup}
                        </MuscleGroup>

                    )}
                    
                />
                   
                {exercisesIsLoading 
                    ? (<ExercisesSkeleton/>) 
                    : (
                        <>
                            <HStack
                                paddingX={2}
                                marginTop={10}
                                alignItems='center'
                                justifyContent='space-between'
                                
                                >
                                <Heading
                                    color={'gray.200'}
                                    fontSize='md'
                                >
                                    Exercícios
                                </Heading>
                                <Text
                                    color={'gray.200'}
                                    fontSize={'sm'}
                                >
                                    {exercises.length}
                                </Text>

                            </HStack>
                        
                            <FlatList marginTop={5}
                                data={exercises}
                                keyExtractor={item => String(item.id)}
                                _contentContainerStyle={{
                                    paddingBottom: '20'
                                }}
                                showsVerticalScrollIndicator={false}
                                renderItem={({item: exercise})=> (
                                    <Card
                                        exercise={exercise}
                                        onPress={() => handleNavigateToExerciseScreen(exercise.id)} 
                                       
                                    />
                                )}

                            />
                        </>

                   )
                   
                }

             


            </VStack>
            
        </VStack>
    )
}