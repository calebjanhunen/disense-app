import React from 'react';
import { Text } from '../../../../components';
import { FSR } from '../../../../interfaces/Sensor';
import { Container } from './fsr-display.styles';

interface Props {
  sensor: FSR;
}

export default function FSRDisplay({ sensor }: Props) {
  return (
    <Container>
      <Text variant='body'>ID: {sensor.id}</Text>
      <Text variant='body'>|</Text>
      <Text variant='body'>Force: {sensor.force}</Text>
    </Container>
  );
}
