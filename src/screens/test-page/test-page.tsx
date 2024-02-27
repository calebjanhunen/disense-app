import React, { useContext } from 'react';
import { Alert, View } from 'react-native';

import { PageView, Spacer } from '@/components';
import { TestInfoContext } from '@/context/test-info-context';
import { useActivityState } from '@/hooks/useActivityState';
import { useSensorData } from '@/hooks/useSensorData';
import { useStopwatch } from '@/hooks/useStopwatch';
import { useUserData } from '@/hooks/useUserData';
import { SensorType } from '@/types/sensor-types';
import * as ExportDBManager from '@/utils/export-db-files';
import { Button, Text } from 'react-native-paper';
import ActivitySelector from './components/activity-selector/activity-selector';
import SensorDataTable from './components/sensor-data-table/sensor-data-table';

export default function TestPage() {
  const {
    activityRunning,
    currentActivityState,
    stopCurrentActivityAndStartNewActivity,
  } = useActivityState();
  const { isTestRunning, beginTest, endTest, user } =
    useContext(TestInfoContext);
  const { startStopwatch, timeDisplay, stopStopwatch } = useStopwatch();
  const { sensorData, getSensorData, noDataText } = useSensorData();
  const { removeCurrentUser } = useUserData();

  async function getSensorDataForTable(sensorType: SensorType) {
    await getSensorData(sensorType);
  }

  async function startTest() {
    if (!user) {
      Alert.alert('No user created', 'Create a user before starting the test');
      return;
    }
    startStopwatch();
    await beginTest();
  }

  function stopTest() {
    Alert.alert(
      'Are you sure you want to stop the test?',
      'This will reset the time and stop saving data to the database',
      [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: async () => {
            stopStopwatch();
            await endTest();
          },
        },
      ]
    );
  }

  async function exportDb() {
    Alert.alert(
      'Are you sure you want to export data',
      'This will remove the current user',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await ExportDBManager.exportDatabaseFilesForUser(user);
            await removeCurrentUser();
          },
        },
      ]
    );
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
        <Text variant='headlineSmall'>{timeDisplay}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text variant='bodyLarge'>User:</Text>
          <Text variant='bodyLarge'>{user !== 0 && user}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
        <Button
          mode='outlined'
          onPress={() => getSensorDataForTable('thermistor')}
        >
          Thermistor
        </Button>
        <Button mode='outlined' onPress={() => getSensorDataForTable('fsr')}>
          FSR
        </Button>
        <Button mode='outlined' onPress={() => getSensorDataForTable('spo2')}>
          SPO2
        </Button>
      </View>
      <Spacer size='sm' />
      <SensorDataTable data={sensorData} noDataText={noDataText} />
      <View style={{ justifyContent: 'flex-end' }}>
        <Spacer size='sm' />
        <Button mode='contained-tonal' onPress={exportDb}>
          Export data
        </Button>
        <Spacer size='sm' />
        <ActivitySelector
          isActivityRunning={activityRunning}
          stopCurrentActivityAndStartNewActivity={
            stopCurrentActivityAndStartNewActivity
          }
          currentActivityState={currentActivityState}
        />
        <Spacer size='xxl' />
        <Button mode='contained' onPress={isTestRunning ? stopTest : startTest}>
          {isTestRunning ? 'Stop Test' : 'Start Test'}
        </Button>
      </View>
      <Spacer size='lg' />
    </PageView>
  );
}
