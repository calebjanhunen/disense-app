import { FSR } from '@/interfaces/Sensor';
import React from 'react';
import { Text } from 'react-native-paper';
import { SquareFsrContainer } from './square-fsr.styles';

interface Props {
  top: number;
  left: number;
  height: number;
  width: number;
  sensor: FSR;
}

export default function SquareFsr({ top, left, height, width, sensor }: Props) {
  return (
    <SquareFsrContainer width={width} height={height} top={top} left={left}>
      <Text variant='labelLarge' style={{ color: 'white' }}>
        {sensor?.force}N
      </Text>
    </SquareFsrContainer>
  );
}
