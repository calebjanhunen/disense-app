import React from 'react';
import { Text } from '../../../../components';
import { Sensor } from '../../../../interfaces/Sensor';
import { SensorType } from '../../../../types/sensor-types';
import { Container } from './sensor-display.styles';

interface Props {
  type: SensorType | undefined;
  sensor: Sensor;
}

export default function SensorDisplay({ type, sensor }: Props) {
  return (
    <Container>
      <Text variant='body'>ID: {sensor.id}</Text>
      <Text variant='body'>|</Text>
      <Text variant='body'>
        {type === 'thermistor' ? 'Temperature' : 'Force'}: {sensor.value}
      </Text>
    </Container>
  );
}
