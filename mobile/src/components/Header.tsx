import { Center, ICenterProps, useTheme } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading } from "./Heading";

interface HeaderProps extends ICenterProps {
    title: string;
}

export function Header({title, ...rest}:HeaderProps){
    const { colors } = useTheme()
    return (
        <SafeAreaView
            style={{ backgroundColor: colors.gray[600], width: '100%' }}
        >
            <Center
                paddingY={5}
            >
                <Heading color={"gray.100"}>
                    {title}
                </Heading>
            </Center>

        </SafeAreaView>

    )
}