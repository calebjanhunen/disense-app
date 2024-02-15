import React from 'react';
import { Text } from '../../../../components';
import { Container } from './spo2-data-display.styles';
import { FlatList } from 'react-native';
import { useSensorData } from '../../../../context/sensor-context';

export default function Spo2DataDisplay() {
  const { spo2Data } = useSensorData();
  console.log('SPO2 component RENDERED');

  return (
    <FlatList
      data={spo2Data}
      renderItem={({ item }) => (
        <Container>
          <Text variant='body'>ID: {item.id}</Text>
          <Text variant='body'>|</Text>
          <Text variant='body'>Heart Rate: {item.heartRate} bpm</Text>
          <Text variant='body'>Blood Oxygen: {item.bloodOxygen}%</Text>
        </Container>
      )}
    />
  );
}
