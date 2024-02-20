import { View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import { PageView, Spacer } from '@/components';
import { Button, Text } from 'react-native-paper';
import { TestInfoContext } from '@/context/test-info-context';
import { useStopwatch } from '@/hooks/useStopwatch';
import SensorDataTable from './sensor-data-table/sensor-data-table';

export default function TestPage() {
  const { isTestRunning, setIsTestRunning, user } = useContext(TestInfoContext);
  const { startStopwatch, timeDisplay, stopStopwatch } = useStopwatch();
  const [sensorType, setSensorType] = useState<'thermistor' | 'fsr' | 'spo2'>(
    'thermistor'
  );

  useEffect(() => {
    console.log('get ', sensorType);
  }, [sensorType]);

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
        <Button
          mode={sensorType === 'thermistor' ? 'contained' : 'outlined'}
          onPress={() => setSensorType('thermistor')}
        >
          Thermistor
        </Button>
        <Button
          mode={sensorType === 'fsr' ? 'contained' : 'outlined'}
          onPress={() => setSensorType('fsr')}
        >
          FSR
        </Button>
        <Button
          mode={sensorType === 'spo2' ? 'contained' : 'outlined'}
          onPress={() => setSensorType('spo2')}
        >
          SPO2
        </Button>
      </View>
      <Spacer size='sm' />
      <SensorDataTable sensorType={sensorType} />
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
