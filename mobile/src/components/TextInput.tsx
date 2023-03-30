import { Input, IInputProps, VStack, useTheme, FormControl } from "native-base";
import { Text } from "./Text";

export interface TextInputProps extends IInputProps {
    error?: string;
}
export function TextInput({error,isInvalid,...rest}: TextInputProps){
    const TextInputIsInvalid = !!error || isInvalid

    const {colors} = useTheme()
    return (
        <FormControl
            isInvalid={TextInputIsInvalid}
            width={"full"}
        >
            <Input
                backgroundColor={"gray.700"}
                fontFamily='body'
                borderRadius={'md'}
                height={14}
                px={4}
                borderColor='gray.700'
                fontSize={'md'}
                color='white'
                isInvalid={TextInputIsInvalid}
                placeholderTextColor={colors.gray[300]}
                _focus={{
                    borderWidth: 1,
                    borderColor: 'green.500',
                    
                }}
                _disabled={{
                    color: 'gray.200',
                    
                }}
                _invalid={{
                    borderColor: 'red.400',
                }}
                
                {...rest}
            />
            {error && (
                <FormControl.ErrorMessage
                    _text={{
                        color: 'red.400'
                    }}
                   
                    marginTop={'2'}
                    fontSize='sm'
                    fontFamily={'body'}
                >
                    {error.toLocaleLowerCase() === 'required' ? 'Preencha o campo' : error}
                </FormControl.ErrorMessage>

            )}

        </FormControl>

        
    )
}