import React from 'react';

import { PageView } from '@/components';
import { useSensorData } from '@/context/sensor-context/sensor-context';
import { DeviceConnectedScreenProps } from '@/types/navigation-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
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
          gap: 40,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <BiomarkerOverview
          onPress={() =>
            navigation.navigate('Temperature Information', {
              thermistorData: sensorData.thermistors,
            })
          }
          icon='thermometer-outline'
          text='Temperature'
        />
        <BiomarkerOverview
          onPress={() =>
            navigation.navigate('Pressure Information', {
              fsrData: sensorData.fsr,
            })
          }
          text='Pressure'
        />
        <BiomarkerOverview
          onPress={() =>
            navigation.navigate('Blood Oxygen Information', {
              spo2Data: spo2Data,
            })
          }
          icon='water-sharp'
          text='Blood Oxygen'
        />
      </View>
      <View
        style={{
          flex: 0.1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Text
          variant='headlineLarge'
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Overall:
        </Text>
        <Text variant='headlineSmall'>Healthy</Text>
      </View>
    </PageView>
  );
}
