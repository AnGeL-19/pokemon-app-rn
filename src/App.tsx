import 'react-native-gesture-handler';
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StackNavigator } from './presentation/navigator/StackNavigator';
import { ThemeContextProvider } from './presentation/context/ThemeContext';


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <StackNavigator />
      </ThemeContextProvider>
    </QueryClientProvider>
    
  )
}

export default App;