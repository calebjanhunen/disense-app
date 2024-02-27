import { useActivityState } from '@/hooks/useActivityState';
import { ActivityState } from '@/interfaces/ActivityState';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from 'react-native-paper';

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
  const [selectedActivityState, setSelectedActivityState] =
    useState<ActivityState | null>(null);
  const {
    activityRunning,
    currentActivityState,
    stopCurrentActivityAndStartNewActivity,
  } = useActivityState();

  async function startSelectedActivity() {
    if (!selectedActivityState) {
      Alert.alert('No activity state selected');
      return;
    }
    setSelectedActivityState(null);
    await stopCurrentActivityAndStartNewActivity(selectedActivityState);
  }

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Dropdown
          // disable={activityRunning}
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
          onChange={item => setSelectedActivityState(item.value)}
          value={selectedActivityState}
        />
        <Button
          style={{
            flex: 0.5,
          }}
          mode='outlined'
          onPress={startSelectedActivity}
          disabled={!activityRunning && !selectedActivityState}
        >
          Start Activity
        </Button>
      </View>
      <Text>
        Current activity: {currentActivityState ? currentActivityState : 'None'}
      </Text>
    </>
  );
}
