import { Heading as NativeBaseHeading, IHeadingProps } from 'native-base'

export function Heading(props: IHeadingProps) {
    return (
        <NativeBaseHeading
            fontFamily={'heading'}
            fontSize={'xl'}
            color='gray.100'
            {...props}
        >

        </NativeBaseHeading>

    )
}