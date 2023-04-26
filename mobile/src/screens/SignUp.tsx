import { useContext, useState } from 'react'
import { Entypo } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { VStack, Image, Center, Icon, ScrollView, useToast } from 'native-base'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from "react-hook-form";


import { Text } from '@components/Text'
import { Button } from '@components/Button'
import { Heading } from '@components/Heading'

import LogoSvg from '@assets/logo.svg'
import backgroundImage from '@assets/background.png'
import { AuthRoutesParamList } from '@routes/auth'
import {z} from 'zod'
import { TextInputControlled } from '@components/Form/TextInput'
import { PasswordTextInputControlled } from '@components/Form/PasswordTextInputControlled'
import { PasswordRegex } from '@utils/Regex'
import { api} from '@libs/axios'
import axios from 'axios'
import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'



const { Regex: passWordRegex, passwordErrorMessage } = PasswordRegex
const newUseSchema = z.object({
    name: z.string({required_error:'Informe o Nome'}).min(3,'O nome Tem que possuir mais de 2 letras'),
    email: z.string().email('digite um email válido'),
    password: z.string().regex(passWordRegex, passwordErrorMessage).transform(data => data.trim()),
    confirmPassword: z.string().optional().transform(data => data && data.trim())

}).superRefine((schemaData, context) => {
    if(schemaData.password !== schemaData.confirmPassword){
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["confirmPassword"],
            message: "Confirme a Senha",
        })
    }
} )

type newUserSchemaData = z.infer<typeof newUseSchema>

export function SignUp({navigation}: NativeStackScreenProps<AuthRoutesParamList, 'SignUp'>){
    const  Toast = useToast()
    const {signIn} = useAuth()


    const {reset,formState, handleSubmit,control} =  useForm<newUserSchemaData>({
        resolver: zodResolver(newUseSchema)
    })
    const {isSubmitting, errors} = formState

     function navigateToSignInScreen() {
        navigation.navigate('SignIn')
    }

    async function handleCreateNewUser(formData: newUserSchemaData){  
        try {
            const {name, email, password} = formData
            await api.post('/users',{
                name,
                email,
                password,
            })
            console.log('foi ')

            
            signIn(email,password)
        } catch (error) {
            const isAppError = error instanceof(AppError)
            const title = isAppError ? error.message : 'Não possível criar a conta, tente novamente'
            
            Toast.show({
                paddingX: 60,
                title,
                backgroundColor: 'red.400',
                placement: 'top'

            })
            
            
        }

    }


    return (
        <ScrollView  
            contentContainerStyle={{flexGrow:1}}
            showsVerticalScrollIndicator={false}
        >
            <VStack
                backgroundColor={'gray.900'}
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
                    flex={1}
                    marginTop={4}
                    paddingX={10}
                    marginBottom={4}
                >
                    <Heading>Crie sua conta</Heading>
                    <TextInputControlled
                        name={'name'}
                        marginTop={8}
                        control={control}
                        placeholder='Nome'
                        error={errors.name?.message}
                    />
                    
                    <TextInputControlled
                        marginTop={8}
                        name={'email'}
                        control={control}
                        placeholder='E-mail'
                        autoCapitalize='none'
                        keyboardType='email-address'
                        error={errors.email?.message}
                    />
                    
                    <PasswordTextInputControlled
                        marginTop={4}
                        control={control}
                        name={'password'}
                        placeholder='Senha'
                        error={errors.password?.message as string}
                     
                    />

                    <PasswordTextInputControlled
                        marginTop={4}
                        control={control}
                        returnKeyType={'send'}
                        name={'confirmPassword'}
                        placeholder='Confirmar senha'
                        onSubmitEditing={handleSubmit(handleCreateNewUser)}
                        error={errors.confirmPassword?.message}
                        
                    />
                    <Button
                        isLoading={isSubmitting}
                        variant={'solid'} 
                        marginTop={4}
                        onPress={handleSubmit(handleCreateNewUser)} 
                    >
                        Criar e acessar
                    </Button>
                </Center>

                <Center
                    padding={10}
                    marginTop={'auto'}
                >
                    <Button
                        
                        onPress={() => navigateToSignInScreen()}
                        marginTop={4} 
                        variant='outline'
                    >
                        Voltar para o login
                    </Button>
                </Center>
            
            </VStack>

        </ScrollView>
    )
} 