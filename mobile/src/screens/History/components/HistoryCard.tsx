import {ComponentProps} from 'react'
import { HStack, VStack, } from "native-base";

import { Text } from "@components/Text";
import { Heading } from "@components/Heading";

interface HistoryCardProps extends ComponentProps<typeof HStack>{
    muscleGroup: string,
    exercise: string,
    timeConclusion: string,
}

export function HistoryCard({ exercise, muscleGroup, timeConclusion, ...rest}: HistoryCardProps){
    return (
        <HStack
            justifyContent={'space-between'}
            alignItems={'center'}
            backgroundColor={"gray.600"}
            rounded={'lg'}
            width={'full'}
            paddingY={'4'}
            paddingX={'5'}
            marginBottom={3}
           
        >
            <VStack flex={1}>
                <Heading numberOfLines={1} textTransform={'capitalize'} fontSize={'md'}>{muscleGroup}</Heading>
                <Text marginTop={2} fontSize={'lg'}>{exercise}</Text>
            </VStack>
            
            
            <Text numberOfLines={1} color={'gray.300'}>
                {timeConclusion}
            </Text>
        </HStack>
    )
}