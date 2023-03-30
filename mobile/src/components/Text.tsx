import {Text as NativeBaseText, ITextProps} from 'native-base'

export function Text(props: ITextProps){
    return (
        <NativeBaseText 
            fontFamily='body'
            fontSize={'md'}
            color='gray.100'
            {...props}
        >

        </NativeBaseText>

    )
}