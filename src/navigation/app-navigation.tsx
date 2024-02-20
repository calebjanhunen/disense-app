import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

import Home from '@/screens/home/home';
import UserSetup from '@/screens/user-setup/user-setup';
import TestPage from '@/screens/test-page/test-page';

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Home'>
        <Tab.Screen
          name='Test Hub'
          component={TestPage}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='beaker-outline' color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name='Home'
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='home-outline' color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name='User Setup'
          component={UserSetup}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='person-outline' color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
