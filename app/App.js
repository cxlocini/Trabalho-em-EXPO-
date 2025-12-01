import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import ListaPessoasScreen from './src/screens/ListaPessoasScreen';
import CadastroPessoaScreen from './src/screens/CadastroPessoaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="ListaPessoas">
          <Stack.Screen 
            name="ListaPessoas" 
            component={ListaPessoasScreen}
            options={{ title: 'Lista de Pessoas' }}
          />
          <Stack.Screen 
            name="CadastroPessoa" 
            component={CadastroPessoaScreen}
            options={{ title: 'Cadastrar Pessoa' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}



