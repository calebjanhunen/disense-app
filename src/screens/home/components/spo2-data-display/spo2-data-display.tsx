import React from 'react';
import { Text } from '../../../../components';
import { SPO2Sensor } from '../../../../interfaces/Sensor';
import { Container } from './spo2-data-display.styles';

interface Props {
  sensor: SPO2Sensor;
}

export default function Spo2DataDisplay({ sensor }: Props) {
  return (
    <Container>
      <Text variant='body'>ID: {sensor.id}</Text>
      <Text variant='body'>|</Text>
      <Text variant='body'>Heart Rate: {sensor.heartRate} bpm</Text>
      <Text variant='body'>Blood Oxygen: {sensor.bloodOxygen}%</Text>
    </Container>
  );
}
