import React from 'react';
import { Text } from '../../../../components';
import { Container } from './fsr-display.styles';
import { FlatList } from 'react-native';
import { useSensorData } from '../../../../context/sensor-context';

export default function FSRDisplay() {
  const { fsrData } = useSensorData();
  console.log('FSR component RENDERED');
  return (
    <FlatList
      data={fsrData}
      renderItem={({ item }) => (
        <Container>
          <Text variant='body'>ID: {item.id}</Text>
          <Text variant='body'>|</Text>
          <Text variant='body'>Force: {item.force}</Text>
        </Container>
      )}
    />
  );
}
