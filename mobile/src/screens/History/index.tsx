import { Header } from "@components/Header";
import { Heading } from "@components/Heading";
import { Text } from "@components/Text";
import { api } from "@libs/axios";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { AppRoutesParamList } from "@routes/appRoutes";
import { FlatList, SectionList, VStack } from "native-base";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { HistoryDTO } from "@dtos/historyDTO";
import { HistoryCard } from './components/HistoryCard'
import { HistoryListEmpty } from "./components/HistoryListEmpty";
import { Loader } from "@components/Loader";


export function History(route: BottomTabScreenProps<AppRoutesParamList, 'History'>){
    const [history, setHistory] = useState<HistoryDTO[]>([])
    const [isFetchingHistory, setIsFetchingHistory] = useState(false)

    
    async function fetchHistory(){
        try {
            setIsFetchingHistory(true)
            const response = await api.get<HistoryDTO[]>('/history')
            setHistory(response.data)
            
        } catch (error) {
            
        }
        finally{
            setIsFetchingHistory(false)
        }
        
    }
  
    
    useFocusEffect(useCallback(() => {
        fetchHistory()
    }, []))

    if(isFetchingHistory) return <Loader/>

    return (
        <VStack flex={1}>
            <Header title="Histórico de Exercícios"/>
            <VStack flex={1} paddingX={8}>
                <SectionList
                    sections={history}
                     keyExtractor={item =>String( item.id)}
                     renderItem={({item:exercise}) => 
                        (
                            <HistoryCard
                                
                                exercise={exercise.name}
                                muscleGroup={exercise.group}
                                timeConclusion={exercise.hour}
                            />
                        )
                    }
                    renderSectionHeader = {({section:{title}}) => (
                        <Heading
                            marginTop={10}
                            marginBottom={3}
                            color='gray.200' 
                            fontSize='md'
                        >
                            {title}
                        </Heading>)
                    }
                    ListEmptyComponent={<HistoryListEmpty/>}
                    contentContainerStyle={{
                        paddingBottom: 20,
                        flexGrow: history? 1 : 0
                    }}
                    showsVerticalScrollIndicator={false}

                />
                
            </VStack>
        </VStack>
    )
}