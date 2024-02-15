import React from 'react';
import { Text } from '../../../../components';
import { Container } from './sensor-display.styles';
import { FlatList } from 'react-native';
import { Thermistor } from '../../../../interfaces/Sensor';

interface Props {
  thermistorData: Thermistor[];
}

export default function ThermistorDisplay({ thermistorData }: Props) {
  // console.log('THERMISTOR component RENDERED');

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
