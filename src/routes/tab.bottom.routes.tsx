import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import Home from '../pages/Home';
import Deliveries from '../pages/Deliveries';
import Analytics from '../pages/Analytics';
import { useTabShow } from '../hooks/context/TabBarShowed';

const Tab = createBottomTabNavigator();

const TabRoutes: React.FC = () => {
  const { tabShow } = useTabShow();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarVisible: tabShow,
      }}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        style: {
          borderTopColor: '#040405',
        },
        tabStyle: {
          backgroundColor: '#040405',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 12,
        },
        activeTintColor: '#00FFFF',
        inactiveBackgroundColor: '#3E404D',
      }}>
      <Tab.Screen
        name="Deliveries"
        component={Deliveries}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="truck" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="users" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="activity" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default TabRoutes;
