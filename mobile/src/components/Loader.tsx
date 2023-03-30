import {Center, Spinner} from 'native-base'

export function Loader(){
    return (
        <Center flexGrow={1}>
            <Spinner
                size='lg'
                color={'green.500'}
                accessibilityLabel="Loading"
            />
        </Center>

    )
}