import React from 'react';
import { Text } from 'react-native-paper';
import { ThermistorContainer } from './thermistor.styles';

interface Props {
  top: number;
  left: number;
  height: number;
  width: number;
  value: number;
}

export default function Thermistor({ top, left, height, width, value }: Props) {
  return (
    <ThermistorContainer height={height} width={width} top={top} left={left}>
      <Text variant='labelLarge'>{value}°C</Text>
    </ThermistorContainer>
  );
}
