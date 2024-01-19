import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import ConnectBLE from '../screens/connect-ble/connect-ble';

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Connect" component={ConnectBLE} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
