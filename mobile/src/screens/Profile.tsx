import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as FileSystem from 'expo-file-system';
import {  TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { AppRoutesParamList } from "@routes/appRoutes";
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs'
import { Box, ScrollView, Skeleton, Toast, useToast, VStack } from "native-base";


import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Avatar } from "@components/Avatar";
import { TextInput } from "@components/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputControlled } from "@components/Form/TextInput";
import { PasswordTextInputControlled } from "@components/Form/PasswordTextInputControlled";
import { PasswordRegex } from "@utils/Regex";
import { useAuth } from "@hooks/useAuth";
import { api } from "@libs/axios";
import { AppError } from "@utils/AppError";

const { Regex: passWordRegex, passwordErrorMessage } = PasswordRegex

const redifineUserProfileDataSchema = z.object({
    name: z.string().min(3, 'O nome Tem que possuir mais de 2 letras'),
    old_password: z.string().optional(),
    password: z.string().optional()
}).superRefine((schemaData, context) => {
    const {password} = schemaData
    if (!!password?.trim() && !passWordRegex.test(password)) {
        
        context.addIssue({
            
            code: z.ZodIssueCode.custom,
            path: ["password"],
            message: passwordErrorMessage,
        })
    }
})


type redifineUserProfileDataSchemaType = z.infer<typeof redifineUserProfileDataSchema>

export function Profile({navigation}: BottomTabScreenProps<AppRoutesParamList,'Profile'>){
    const { user, upadateUserProfile} = useAuth()
    const [photoIsLoading, setPhotoIsLoading] = useState(true)
    const [userAvatar, setUserAvatar] = useState<string | undefined>(`${api.defaults.baseURL}/avatar/${user.avatar}`);

    const toast = useToast()

    const {  formState, handleSubmit, control } = useForm<redifineUserProfileDataSchemaType>({
        resolver: zodResolver(redifineUserProfileDataSchema),
        defaultValues: {
            name: user?.name
        }
    })

    const { isSubmitting, errors } = formState

    
    async function handlePickImage(){
        setPhotoIsLoading(true)

        try {
            const imageResponse = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality:1,
                aspect: [4,4],
                selectionLimit: 1
            })
     
    
            if (imageResponse.canceled || !imageResponse.assets[0].uri ) return;

            const imageSelected = imageResponse.assets[0]
            const photoInfo = await FileSystem.getInfoAsync(imageSelected.uri)

            if(photoInfo.exists && (photoInfo.size  / 1024 /1024 ) >    5) {
                return toast.show({
                    title: 'Está foto é muito grande, Escolha uma de até 5Mb',
                    backgroundColor: 'red.400',
                    placement: 'top',
                    
                    
                })
                
            }
            const fileExtension = imageSelected.uri.split('.').pop()

            const userNameWithoutSpaces = user.name.trim().replaceAll(' ','').toLowerCase()

            const photoFile =  {
                name: `${userNameWithoutSpaces}.${fileExtension}`,
                uri: imageSelected.uri,
                type: `${imageSelected.type}/${fileExtension}`
            }
           
            const userPhotUploadForm =  new FormData();
            userPhotUploadForm.append('avatar', photoFile as any)
                 
            const avatarUpdatedResponse = await api.patch<{avatar: string}>('/users/avatar', userPhotUploadForm,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            const userDataUpdated = user
            userDataUpdated.avatar = avatarUpdatedResponse.data.avatar
            setUserAvatar(imageSelected.uri)
            upadateUserProfile(userDataUpdated)
            
        } catch (error) {
            console.log(error)
        }
        finally {
            setPhotoIsLoading(false)
        }
    }

    async function handleRedifineUserProfile(formData: redifineUserProfileDataSchemaType){
        try {
            const { old_password, password, name} = formData
            console.log(formData)
            await api.put('/users',{
                name,
                password, 
                old_password,
            })

            const userDataUpdated = user
            userDataUpdated.name = name

            await upadateUserProfile(userDataUpdated)
            navigation.navigate('Home')

            Toast.show({
                title: 'Perfil atualizado com sucesso',
                backgroundColor: 'green.500',
                placement: 'top',
                paddingX: '3',
                


            })
        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Falha ao atualizar o perfil, tente novamente mais tarde'
            Toast.show({
                title,
                placement: 'top',
                backgroundColor: 'red.400'

            })      
        }

    }
    const PhotoSize = 33
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack 
                flex={1}
                backgroundColor='gray.900'
            >
                <Header title="Perfil"/>

                <VStack
                    padding={8}
                    flex={1}
                    alignItems='center' 
                >  
                    {photoIsLoading && !userAvatar ?(
                        <Skeleton
                            
                            height={PhotoSize}
                            rounded='full'
                            endColor={'gray.400'}
                            startColor={'gray.500'}
                            width={PhotoSize}
                        />

                    ): (
                        <Avatar
                            size={PhotoSize}
                            source={{ uri: userAvatar}}
                        />

                    )}
                    <TouchableOpacity
                        onPress={handlePickImage}
                        hitSlop={{
                            right: 40,
                            left: 40,
                            top: 10,
                            bottom: 10
                        }}
                        style={{
                            marginTop:12
                        }}
                    >
                        <Text
                            fontFamily={'heading'}
                            color={"green.500"}
                        >
                            Alterar  foto
                        </Text>

                    </TouchableOpacity>
                    

                    <VStack marginTop={10} flex={1} width={'full'}>
                        <Box>
                            <TextInputControlled
                                control={control}
                                name='name'
                                error={errors.name?.message}
                                backgroundColor={'gray.600'}
                                placeholder="Nome"
                                />
                            <TextInput
                                keyboardType="email-address"
                                isDisabled={true}
                                
                                value={user?.email}
                                marginTop={4}
                                backgroundColor={'gray.600'}
                                placeholder="email"
                            />

                        </Box>

                        <Box marginTop={12}>
                            <Text color={"gray.200"}>Alterar senha</Text>

                            <PasswordTextInputControlled
                                control={control}
                                name='old_password'
                                error={errors.old_password?.message}
                                
                                marginTop={4}
                                placeholder={'Senha antiga'}
                                backgroundColor={'gray.600'}
                             
                            />

                            <PasswordTextInputControlled
                                control={control}
                                name='password'
                                error={errors.password?.message}
                                marginTop={4}
                                placeholder={'Nova Senha'}
                                backgroundColor={'gray.600'}
                                marginBottom={4}
                            />
                            


                        </Box>
                        <Box marginTop={'auto'} >
                            <Button
                                isLoading={isSubmitting}
                                onPress={handleSubmit(handleRedifineUserProfile)}
                                marginTop={4}
                            >
                                Atualizar
                            </Button>

                        </Box>
                    </VStack>
                    
                </VStack>
            </VStack>

        </ScrollView>
    )
}