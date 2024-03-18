import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import DeviceConnected from '@/screens/home/device-connected';
import FsrInfo from '@/screens/home/fsr-info';
import Spo2Info from '@/screens/home/spo2-info';
import ThermistorInfo from '@/screens/home/thermistor-info';
import { HomeScreenStackParamList } from '@/types/navigation-types';

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
      <Stack.Screen name='FsrInfo' component={FsrInfo} />
      <Stack.Screen name='Spo2Info' component={Spo2Info} />
    </Stack.Navigator>
  );
}
