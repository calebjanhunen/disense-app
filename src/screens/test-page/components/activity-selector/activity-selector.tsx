import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { ActivityState } from '@/interfaces/ActivityState';

interface Data {
  label: string;
  value: ActivityState;
}
const data: Data[] = [
  { label: 'Sitting', value: 'sitting' },
  { label: 'Walking', value: 'walking' },
  { label: 'Running', value: 'running' },
];

export default function ActivitySelector() {
  const [activityState, setActivityState] = useState<ActivityState>();
  const [activityRunning, setActivityRunning] = useState<boolean>(false);

  function startActivity() {
    setActivityRunning(true);
  }

  function stopActivity() {
    setActivityRunning(false);
  }

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Dropdown
        disable={activityRunning}
        placeholder='Select Activity'
        style={{
          flex: 1,
          backgroundColor: activityRunning ? 'grey' : 'white',
          borderRadius: 20,
          padding: 6,
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
        onPress={activityRunning ? stopActivity : startActivity}
        disabled={!activityState}
      >
        {activityRunning ? 'Stop Activity' : 'Start Activity'}
      </Button>
    </View>
  );
}
