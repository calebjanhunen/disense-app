import { View } from 'react-native';
import React, { useContext } from 'react';

import { PageView, Spacer } from '@/components';
import { Button, Text } from 'react-native-paper';
import { TestInfoContext } from '@/context/test-info-context';
import { useStopwatch } from '@/hooks/useStopwatch';
import SensorDataTable from './components/sensor-data-table/sensor-data-table';
import { SensorType } from '@/types/sensor-types';
import { useSensorData } from '@/hooks/useSensorData';

export default function TestPage() {
  const { isTestRunning, setIsTestRunning, user } = useContext(TestInfoContext);
  const { startStopwatch, timeDisplay, stopStopwatch } = useStopwatch();
  const { sensorData, getSensorData } = useSensorData();

  async function getSensorDataForTable(sensorType: SensorType) {
    await getSensorData(sensorType);
  }

  function startTest() {
    startStopwatch();
    setIsTestRunning(true);
  }

  function stopTest() {
    stopStopwatch();
    setIsTestRunning(false);
  }

  return (
    <PageView>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text variant='displaySmall'>{timeDisplay}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text variant='bodyLarge'>User:</Text>
          <Text variant='bodyLarge'>{user !== 0 && user}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
        <Button onPress={() => getSensorDataForTable('thermistor')}>
          Thermistor
        </Button>
        <Button onPress={() => getSensorDataForTable('fsr')}>FSR</Button>
        <Button onPress={() => getSensorDataForTable('spo2')}>SPO2</Button>
      </View>
      <Spacer size='sm' />
      <SensorDataTable sensorType='thermistor' data={sensorData} />
      <View style={{ justifyContent: 'flex-end' }}>
        <Spacer size='sm' />
        <Button mode='contained-tonal'>Export data</Button>
        <Spacer size='xxl' />
        <Button mode='contained' onPress={isTestRunning ? stopTest : startTest}>
          {isTestRunning ? 'Stop Test' : 'Start Test'}
        </Button>
      </View>
      <Spacer size='lg' />
    </PageView>
  );
}
