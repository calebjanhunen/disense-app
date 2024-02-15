import React from 'react';
import { Text } from '../../../../components';
import { Container } from './sensor-display.styles';
import { useSensorData } from '../../../../context/sensor-context';
import { FlatList } from 'react-native';

export default function ThermistorDisplay() {
  const { thermistorData } = useSensorData();
  console.log('THERMISTOR component RENDERED');

  return (
    <FlatList
      data={thermistorData}
      renderItem={({ item }) => (
        <Container>
          <Text variant='body'>ID: {item.id}</Text>
          <Text variant='body'>|</Text>
          <Text variant='body'>Temperature: {item.temp}</Text>
        </Container>
      )}
    />
  );
}
