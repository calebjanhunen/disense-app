import React from 'react';
import { Text } from 'react-native-paper';
import { SquareFsrContainer } from './square-fsr.styles';

interface Props {
  top: number;
  left: number;
  height: number;
  width: number;
  value: number;
}

export default function SquareFsr({ top, left, height, width, value }: Props) {
  return (
    <SquareFsrContainer width={width} height={height} top={top} left={left}>
      <Text variant='labelLarge' style={{ color: 'white' }}>
        {value}N
      </Text>
    </SquareFsrContainer>
  );
}
