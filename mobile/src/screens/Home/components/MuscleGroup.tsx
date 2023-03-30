import { Text } from '@components/Text'
import {  IButtonProps , Pressable, IPressableProps} from 'native-base'
import { ReactNode } from 'react'



interface ButtonProps extends IPressableProps {
    children?: string | number,
    isSelected: boolean | undefined
}



export function MuscleGroup({ children,isSelected=false, ...rest }: ButtonProps){
    return (

        <Pressable
            alignItems={'center'}
            justifyContent={'center'}
            backgroundColor='gray.600'
            color={'gray.200'}
            marginRight='2'
            rounded={'md'}
            height={10}
            paddingX={4}
            borderWidth={'1'}
            borderColor={isSelected ? 'green.500': 'gray.600'}

            {...rest}
        >
            <Text
                fontSize={'xs'}
                fontFamily={'body'}
                color={isSelected ? 'green.500' : 'gray.200'}
                textTransform={'uppercase'}
            >
                {children}

            </Text>
        </Pressable>
    )
}
