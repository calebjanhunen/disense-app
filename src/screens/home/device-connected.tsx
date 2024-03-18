import React from 'react';

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
      <Button
        onPress={() =>
          navigation.navigate('ThermistorInfo', {
            thermistorData: sensorData.thermistors,
          })
        }
      >
        View Thermistor Info
      </Button>
      <Button
        onPress={() =>
          navigation.navigate('FsrInfo', {
            fsrData: sensorData.fsr,
          })
        }
      >
        View Fsr Info
      </Button>

      <Button
        onPress={() =>
          navigation.navigate('Spo2Info', {
            spo2Data: spo2Data,
          })
        }
      >
        View Spo2 Info
      </Button>
    </PageView>
  );
}
