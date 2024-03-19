import React from 'react';

import { PageView } from '@/components';
import { useSensorData } from '@/context/sensor-context/sensor-context';
import { DeviceConnectedScreenProps } from '@/types/navigation-types';
import { View } from 'react-native';
import BiomarkerOverview from './components/biomarker-overview/biomarker-overview';
import ConnectedDeviceHeader from './components/connected-device-header/connected-device-header';

export default function DeviceConnected({
  navigation,
}: DeviceConnectedScreenProps) {
  const { sensorData, spo2Data } = useSensorData();

  return (
    <PageView>
      <ConnectedDeviceHeader />
      <View
        style={{
          gap: 60,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <BiomarkerOverview
          onPress={() =>
            navigation.navigate('ThermistorInfo', {
              thermistorData: sensorData.thermistors,
            })
          }
          icon='thermometer-outline'
        />
        <BiomarkerOverview
          onPress={() =>
            navigation.navigate('FsrInfo', { fsrData: sensorData.fsr })
          }
        />
        <BiomarkerOverview
          onPress={() =>
            navigation.navigate('Spo2Info', { spo2Data: spo2Data })
          }
          icon='water-sharp'
        />
      </View>
    </PageView>
  );
}
