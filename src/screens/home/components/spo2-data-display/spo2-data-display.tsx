import React from 'react';
import { Text } from '../../../../components';
import { Container } from './spo2-data-display.styles';
import { FlatList } from 'react-native';
import { SPO2Sensor } from '../../../../interfaces/Sensor';

interface Props {
  spo2Data: SPO2Sensor[];
}

export default function Spo2DataDisplay({ spo2Data }: Props) {
  // console.log('SPO2 component RENDERED');

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
