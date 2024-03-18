import React from 'react';
import { Text } from 'react-native';

import { PageView } from '@/components';
import { useSensorData } from '@/context/sensor-context/sensor-context';
import { DeviceConnectedScreenProps } from '@/types/navigation-types';
import { Button } from 'react-native-paper';
import ConnectedDeviceHeader from './components/connected-device-header/connected-device-header';

export default function DeviceConnected({
  navigation,
}: DeviceConnectedScreenProps) {
  const { sensorData, spo2Data } = useSensorData();

  return (
    <PageView>
      <ConnectedDeviceHeader />

      <Text>DeviceConnected</Text>
      <Button
        onPress={() =>
          navigation.navigate('ThermistorInfo', {
            thermistorData: sensorData.thermistors,
          })
        }
      >
        View Thermistor Info
      </Button>
    </PageView>
  );
}
