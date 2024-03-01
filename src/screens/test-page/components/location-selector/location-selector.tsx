import { Location } from '@/interfaces/Location';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface Data {
  label: string;
  value: Location;
}
const data: Data[] = [
  { label: 'Outside', value: 'outside' },
  { label: 'Inside', value: 'inside' },
];

interface Props {
  currentLocation: Location | null;
  stopCurrentLocationAndStartNewLocation: (location: Location) => Promise<void>;
}

export default function LocationSelector({
  currentLocation,
  stopCurrentLocationAndStartNewLocation,
}: Props) {
  const [currLocationDisp, setCurrLocationDisp] = useState<string>('');

  /* The `useEffect` hook is responsible for updating the displayed current
 activity based on the `currentActivityState` prop. */
  useEffect(() => {
    const currLocation: Data | undefined = data.find(
      activity => activity.value === currentLocation
    );
    setCurrLocationDisp(currLocation ? currLocation.label : '');
  }, [currentLocation]);

  async function startSelectedActivity(selectedLocation: Location) {
    if (!selectedLocation) {
      Alert.alert('No activity state selected');
      return;
    }
    await stopCurrentLocationAndStartNewLocation(selectedLocation);
  }

  return (
    <View>
      <Dropdown
        placeholder='Select Location'
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
        Current location: {currLocationDisp ? currLocationDisp : 'None'}
      </Text>
    </View>
  );
}
