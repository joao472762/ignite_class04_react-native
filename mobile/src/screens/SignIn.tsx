import { useState } from 'react'
import {Entypo} from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import {VStack, Image, Center, Icon, ScrollView, useToast} from 'native-base'
import {zodResolver} from '@hookform/resolvers/zod'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useForm } from "react-hook-form";

import { Text } from '@components/Text'
import { Button } from '@components/Button'
import { Heading } from '@components/Heading'

import  LogoSvg from '@assets/logo.svg'
import backgroundImage from '@assets/background.png'
import { AuthRoutesParamList } from '@routes/auth'
import { TextInputControlled } from '@components/Form/TextInput'
import { z } from 'zod'
import { PasswordTextInputControlled } from '@components/Form/PasswordTextInputControlled'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'

const userLoggedSchema = z.object({
    email: z.string().email('digite um email válido'),
    password: z.string().min(1, 'preencha o campo de senha'),
})

export type userLoggedSchemaData = z.infer<typeof userLoggedSchema>

export function SignIn({ navigation}: NativeStackScreenProps<AuthRoutesParamList,'SignIn'>){
    const {signIn} = useAuth()
    const toast = useToast()

    const { control, handleSubmit, formState } = useForm<userLoggedSchemaData>({
        resolver: zodResolver(userLoggedSchema)
    })
    const {errors,isSubmitting} =  formState
    
    
     function navigateToSignUpScreen() {
         navigation.navigate('SignUp')
        
    }

    async function handleSignIn(formData: userLoggedSchemaData){
        const {email,password} = formData
        try {
            await signIn(email, password)
        } catch(error){
          
            const isAppError = error instanceof(AppError)
            const title = isAppError ? error.message : 'Error no Sevidor'

            toast.show({
                title: title,
                backgroundColor: 'red.400',
                placement: 'top',
                paddingX: '10',
            })
        }
    }
    return (
        <ScrollView
        
            contentContainerStyle={{flexGrow:1}}
            showsVerticalScrollIndicator={false}
        >
            <VStack 
                flex={1}
            >
                <Image
                    alt='pessoar treinando'
                    source={backgroundImage}
                    defaultSource={backgroundImage}
                    position='absolute'
                    resizeMode='cover'
                />
                <SafeAreaView>
                    <Center marginTop={16}>
                    <LogoSvg/>
                        <Text
                            fontSize={'sm'}
                        >Treine sua mente e o seu corpo</Text>
                    </Center>
                </SafeAreaView>

                <Center
                    marginTop={4}
                    flex={1}
                    paddingX={10}
                 
                    marginBottom={4}
                >
                    <Heading>Acesse sua conta</Heading>
                    <TextInputControlled
                        marginTop={8}
                        name='email'
                        control={control} 
                        placeholder='E-mail'
                        autoCapitalize='none'
                        keyboardType='email-address'
                        error={errors.email?.message}
                    />
                    <PasswordTextInputControlled
                        marginTop={4}
                        name='password'
                        control={control}
                        placeholder='Senha'
                        returnKeyType={'send'}
                        onSubmitEditing={handleSubmit(handleSignIn)}
                        error={errors.password?.message}
                        
                    />
                    <Button 
                        variant={'solid'} 
                        marginTop={4} 
                        isLoading={isSubmitting}
                        onPressIn={handleSubmit(handleSignIn)}

                    >
                        Acessar
                    </Button>
                </Center>

                <Center
             
                    padding={10}
                    marginTop={'auto'}
                >
                    <Text marginBottom={2} marginTop={4}>Ainda não tem acesso?</Text>
                    <Button
                        
                     
                        onPress={() => navigateToSignUpScreen()} 
                        variant='outline'
                    >
                        Criar conta
                    </Button>
                </Center>
            
            </VStack>

        </ScrollView>
    )
} 