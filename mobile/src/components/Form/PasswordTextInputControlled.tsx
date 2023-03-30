import { PasswordTextInput } from "@components/PasswordTextInput";
import { TextInputProps } from "@components/TextInput";
import { userLoggedSchemaData } from "@screens/SignIn";
import { Controller } from "react-hook-form";
import { Control } from "react-hook-form/dist/types";



interface PasswordTextInputControlledProps extends TextInputProps {
    name: 'password' | 'confirmPassword' | 'newPassword' ,
    control: Control<userLoggedSchemaData | any>
}

export function PasswordTextInputControlled({ control, name, ...rest }: PasswordTextInputControlledProps) {
    return (
        <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
                <PasswordTextInput
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