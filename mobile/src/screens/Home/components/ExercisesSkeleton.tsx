import { HStack, Skeleton, VStack } from "native-base";

export function ExercisesSkeleton(){
    return (
        <VStack>

            <HStack
                paddingX={2}
                marginTop={10}
                alignItems='center'
                justifyContent='space-between'

            >
                <Skeleton
                    width={"10"}
                    height={'4'}
                    rounded='sm'
                    endColor={'gray.400'}
                    startColor={'gray.500'}
                />

                <Skeleton
                    width={"4"}
                    height={'4'}
                    rounded='sm'
                    endColor={'gray.400'}
                    startColor={'gray.500'}
                />

            </HStack>
            <Skeleton
                marginTop={5}
                height={20}
                endColor={'gray.400'}
                startColor={'gray.500'}
                width='full'
                rounded={'md'}
                marginBottom={3}
            />
        </VStack>

    )
}