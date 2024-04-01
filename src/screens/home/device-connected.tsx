import React, { useEffect, useState } from 'react';

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
  const {
    sensorData,
    spo2Data,
    atRiskThermistors,
    isPressureAtRisk,
    isSpo2AtRisk,
  } = useSensorData();
  const [thermistorRiskLevel, setThermistorRiskLevel] = useState<0 | 1 | 2>(0);
  const [pressureRiskLevel, setPressureRiskLevel] = useState<0 | 1 | 2>(0);
  const [spo2RiskLevel, setSpo2RiskLevel] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    if (atRiskThermistors.length > 0) {
      setThermistorRiskLevel(2);
    } else {
      setThermistorRiskLevel(0);
    }
  }, [atRiskThermistors]);

  useEffect(() => {
    if (isPressureAtRisk) {
      setPressureRiskLevel(2);
    } else {
      setPressureRiskLevel(0);
    }
  }, [isPressureAtRisk]);

  useEffect(() => {
    if (isSpo2AtRisk) {
      setSpo2RiskLevel(2);
    } else {
      setSpo2RiskLevel(0);
    }
  }, [isSpo2AtRisk]);

  function calculateTotalRiskLevel(): string {
    const totalRiskLevel =
      spo2RiskLevel + pressureRiskLevel + thermistorRiskLevel;
    if (totalRiskLevel === 0) {
      return 'Healthy';
    } else if (totalRiskLevel > 0 && totalRiskLevel < 3) {
      return 'Moderate Risk';
    } else if (totalRiskLevel > 2) {
      return 'High Risk';
    }
    return 'Healthy';
  }

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
          riskLevel={thermistorRiskLevel}
        />
        <BiomarkerOverview
          onPress={() =>
            navigation.navigate('Pressure Information', {
              fsrData: sensorData.fsr,
            })
          }
          text='Pressure'
          riskLevel={pressureRiskLevel}
        />
        <BiomarkerOverview
          onPress={() =>
            navigation.navigate('Blood Oxygen Information', {
              spo2Data: spo2Data,
            })
          }
          icon='water-sharp'
          text='Blood Oxygen'
          riskLevel={spo2RiskLevel}
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
        <Text variant='headlineSmall'>{calculateTotalRiskLevel()}</Text>
      </View>
    </PageView>
  );
}
