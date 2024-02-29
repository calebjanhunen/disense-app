import { Thermistor as IThermistor } from '@/interfaces/Sensor';
import React from 'react';
import { Text } from 'react-native-paper';
import { ThermistorContainer } from './thermistor.styles';

interface Props {
  top: number;
  left: number;
  height: number;
  width: number;
  sensor: IThermistor;
}

export default function Thermistor({
  top,
  left,
  height,
  width,
  sensor,
}: Props) {
  return (
    <ThermistorContainer height={height} width={width} top={top} left={left}>
      <Text variant='labelLarge'>{sensor?.temp}°C</Text>
    </ThermistorContainer>
  );
}
