import React from 'react';
import { Text } from '../../../../components';
import { Sensor } from '../../../../interfaces/Sensor';
import { Container } from './sensor-display.styles';

interface Props {
  sensor: Sensor;
}

export default function SensorDisplay({ sensor }: Props) {
  return (
    <Container>
      <Text variant='body'>ID: {sensor.id}</Text>
      <Text variant='body'>|</Text>
      <Text variant='body'>temp: {sensor.temp}</Text>
    </Container>
  );
}
