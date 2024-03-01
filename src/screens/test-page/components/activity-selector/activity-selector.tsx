import { ActivityState } from '@/interfaces/ActivityState';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface Data {
  label: string;
  value: ActivityState;
}
const data: Data[] = [
  { label: 'Laying down', value: 'laying_down' },
  { label: 'Sitting (feet on the ground)', value: 'sitting_feet_on_ground' },
  { label: 'Sitting (feet up)', value: 'sitting_feet_up' },
  { label: 'Standing', value: 'standing' },
  { label: 'Walking', value: 'walking' },
  { label: 'Jogging', value: 'jogging' },
];

interface Props {
  currentActivityState: ActivityState | null;
  stopCurrentActivityAndStartNewActivity: (
    activity: ActivityState
  ) => Promise<void>;
}

export default function ActivitySelector({
  currentActivityState,
  stopCurrentActivityAndStartNewActivity,
}: Props) {
  const [currActivityDisp, setCurrActivityDisp] = useState<string>('');

  /* The `useEffect` hook is responsible for updating the displayed current
 activity based on the `currentActivityState` prop. */
  useEffect(() => {
    const currActivity: Data | undefined = data.find(
      activity => activity.value === currentActivityState
    );
    setCurrActivityDisp(currActivity ? currActivity.label : '');
  }, [currentActivityState]);

  async function startSelectedActivity(selectedActivity: ActivityState) {
    if (!selectedActivity) {
      Alert.alert('No activity state selected');
      return;
    }
    await stopCurrentActivityAndStartNewActivity(selectedActivity);
  }

  return (
    <View>
      <Dropdown
        placeholder='Select Activity'
        style={{
          flex: 1,
          borderRadius: 20,
          padding: 20,
          borderColor: 'black',
          borderWidth: 1,
        }}
        labelField='label'
        valueField='value'
        data={data}
        onChange={item => startSelectedActivity(item.value)}
      />
      <Text>
        Current activity: {currActivityDisp ? currActivityDisp : 'None'}
      </Text>
    </View>
  );
}
