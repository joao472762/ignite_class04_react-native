import {Avatar as NativeBaseAvatar, IAvatarProps, useTheme} from 'native-base'
import UserFallBackSvg from '@assets/profile.svg'

export function Avatar(props:IAvatarProps){
    const {colors} = useTheme()
    return (
        <NativeBaseAvatar
            borderWidth={'2'}
            borderColor={'gray.400'} 
            {...props}
        
        >
            <UserFallBackSvg
                fill={colors.gray[300]}
            />
        </NativeBaseAvatar>
    )
}