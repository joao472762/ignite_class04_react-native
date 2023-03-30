import { TextInputProps,TextInput } from "@components/TextInput";
import { userLoggedSchemaData } from "@screens/SignIn";
import { Controller } from "react-hook-form";
import { Control } from "react-hook-form/dist/types";



interface TextInputControlledProps extends TextInputProps {
    name:  'email'| 'name',
    control: Control<userLoggedSchemaData | any>
}

export function TextInputControlled({ control, name,...rest }: TextInputControlledProps){
    return (
        <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    {...rest}
                />
            )}
            name={name}
        />
    )
}