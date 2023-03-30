import {useFonts,Roboto_400Regular, Roboto_700Bold} from '@expo-google-fonts/roboto'
import { NativeBaseProvider, VStack,StatusBar } from 'native-base';
import { Loader } from '@components/Loader';
import {Router} from '@routes/index'
import { theme } from '@styles/theme';
import { AuthContextProvider } from '@context/AuthContext';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@libs/react_query';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  })

  
  return ( 
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor='transparent'
        animated
        translucent
      />
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <VStack backgroundColor={'gray.900'} flex={1}>
            {fontsLoaded ? <Router/>  : <Loader /> }
          </VStack>

        </AuthContextProvider>

      </QueryClientProvider>
    </NativeBaseProvider>
  );
}


