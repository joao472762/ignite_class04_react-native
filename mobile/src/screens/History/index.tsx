import { Header } from "@components/Header";
import { Heading } from "@components/Heading";
import { Text } from "@components/Text";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppRoutesParamList } from "@routes/appRoutes";
import { FlatList, SectionList, VStack } from "native-base";
import { HistoryCard } from './components/HistoryCard'
import { HistoryListEmpty } from "./components/HistoryListEmpty";


export function History(route: BottomTabScreenProps<AppRoutesParamList, 'History'>){
    const history = [[0, 2, 3], [0, 2, 3], [0, 2, 3]]
    const exercises = [
        {
            title: '02/02/2021',
            data: ['Puxada frontal', 'Remada unilateral', 'Risotto'],
        },
        {
            title: '02/02/2021',
            data: ['Puxada frontal', 'Remada unilateral', 'Risotto'],

        },
        {
            title: '02/02/2021',
            data: ['Puxada frontal', 'Remada unilateral', 'Risotto'],
        },
        {
            title: '02/02/2021',
            data: ['Puxada frontal', 'Remada unilateral', 'Risotto'],

        },
        
    ];

    return (
        <VStack flex={1}>
            <Header title="Histórico de Exercícios"/>
            <VStack flex={1} paddingX={8}>
                <SectionList
                     sections={exercises}
                     keyExtractor={item => item}
                     renderItem={({item}) => 
                        (
                            <HistoryCard 
                                exercise={item}
                                muscleGroup={'constas'}
                                timeConclusion={'18:05'}
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
                        flexGrow: exercises? 1 : 0
                    }}
                    showsVerticalScrollIndicator={false}

                />
                
            </VStack>
        </VStack>
    )
}