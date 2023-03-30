import { TextInput, TextInputProps } from "./TextInput";
import { Entypo } from '@expo/vector-icons'

import { Icon } from "native-base";
import { useState,useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";




export function PasswordTextInput(props: TextInputProps ){
    const [passWordIsHiding, setPassWordIsHiding] = useState(true)
  
    function handleChangePasswordVisibility() {
        passWordIsHiding
            ? setPassWordIsHiding(false)
            : setPassWordIsHiding(true)
    }

    useFocusEffect(useCallback(() => {setPassWordIsHiding(true)},[]))

    return (
        <TextInput
            secureTextEntry={passWordIsHiding}
            InputRightElement={
                <Icon
                    size={'md'}
                    marginRight={'4'}
                    color={passWordIsHiding ? 'gray.100' : 'white'}
                    onPress={() => handleChangePasswordVisibility()}
                    as={<Entypo name={passWordIsHiding ? 'eye-with-line' : 'eye'} />}
                />
            }
            {...props}
        />
    )
}

