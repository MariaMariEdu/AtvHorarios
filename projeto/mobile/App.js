import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import InstituicoesScreen from './src/components/Instituicoes/InstituicoesScreen';
import CursosScreen from './src/components/Cursos/CursosScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#6200ee',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen 
            name="Instituicoes" 
            component={InstituicoesScreen}
            options={{
              title: 'Instituições',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="office-building" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Cursos" 
            component={CursosScreen}
            options={{
              title: 'Cursos',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="school" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
