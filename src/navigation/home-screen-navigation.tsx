import DeviceConnected from '@/screens/home/device-connected';
import ThermistorInfo from '@/screens/home/thermistor-info';
import { HomeScreenStackParamList } from '@/types/navigation-types';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator<HomeScreenStackParamList>();

export default function HomeScreenNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='DeviceConnected'
        options={{ headerShown: false }}
        component={DeviceConnected}
      />
      <Stack.Screen name='ThermistorInfo' component={ThermistorInfo} />
    </Stack.Navigator>
  );
}
