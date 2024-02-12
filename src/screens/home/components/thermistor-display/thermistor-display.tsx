import React from 'react';
import { Text } from '../../../../components';
import { Thermistor } from '../../../../interfaces/Sensor';
import { Container } from './sensor-display.styles';

interface Props {
  sensor: Thermistor;
}

export default function ThermistorDisplay({ sensor }: Props) {
  return (
    <Container>
      <Text variant='body'>ID: {sensor.id}</Text>
      <Text variant='body'>|</Text>
      <Text variant='body'>Temperature: {sensor.temp}</Text>
    </Container>
  );
}
