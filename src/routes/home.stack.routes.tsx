import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Details from '../pages/Details';
import RegisterUser from '../pages/RegisterUser';
import Profile from '../pages/Profile';
import RegisterProduction from '../pages/RegisterProduction';
import RegisterCompany from '../pages/RegisterCompany';
import TabBar from './tab.bottom.routes';

const Stack = createStackNavigator();

const HomeStackRoutes: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={TabBar} />
      <Stack.Screen
        name="RegisterUser"
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerTintColor: '#fff',
          title: '',
        }}
        component={RegisterUser}
      />
      <Stack.Screen
        name="RegisterCompany"
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerTintColor: '#fff',
          title: '',
        }}
        component={RegisterCompany}
      />
      <Stack.Screen
        name="Details"
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerTintColor: '#fff',
          title: 'Detalhes',
        }}
        component={Details}
      />
      <Stack.Screen
        name="RegisterProduction"
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerTintColor: '#fff',
          title: '',
        }}
        component={RegisterProduction}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerTintColor: '#fff',
        }}
        name="Profile"
        component={Profile}
      />
    </Stack.Navigator>
  );
};

export default HomeStackRoutes;
