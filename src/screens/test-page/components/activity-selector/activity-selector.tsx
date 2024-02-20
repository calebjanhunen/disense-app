import { View, Text, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { ActivityState } from '@/interfaces/ActivityState';
import { useActivityState } from '@/hooks/useActivityState';

interface Data {
  label: string;
  value: ActivityState;
}
const data: Data[] = [
  { label: 'Sitting', value: 'sitting' },
  { label: 'Standing', value: 'standing' },
  { label: 'Walking', value: 'walking' },
  { label: 'Running', value: 'running' },
];

export default function ActivitySelector() {
  const [activityState, setActivityState] = useState<ActivityState>();
  const {
    startActivity,
    endActivity,
    getCurrentActivity,
    activityRunning,
    currentActivityLabel,
  } = useActivityState();

  useEffect(() => {
    getCurrentActivity();
  }, []);

  async function startSelectedActivity() {
    if (!activityState) {
      Alert.alert('No activity state selected');
      return;
    }
    await startActivity(activityState);
  }

  async function stopActivity() {
    await endActivity();
  }

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Dropdown
          disable={activityRunning}
          placeholder='Select Activity'
          style={{
            flex: 1,
            borderRadius: 20,
            padding: 6,
            borderColor: 'black',
            borderWidth: 1,
          }}
          labelField='label'
          valueField='value'
          data={data}
          onChange={item => setActivityState(item.value)}
          value={activityState}
        />
        <Button
          style={{
            backgroundColor: activityRunning ? 'red' : 'white',
            flex: 0.5,
          }}
          mode='outlined'
          onPress={activityRunning ? stopActivity : startSelectedActivity}
          disabled={!activityRunning && !activityState}
        >
          {activityRunning ? 'Stop Activity' : 'Start Activity'}
        </Button>
      </View>
      {currentActivityLabel && (
        <Text>Current activity: {currentActivityLabel}</Text>
      )}
    </>
  );
}
