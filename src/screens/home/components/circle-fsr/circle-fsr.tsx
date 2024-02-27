import React from 'react';
import { Text } from 'react-native-paper';
import { CircleFsrContainer } from './circle-fsr.styles';

interface Props {
  top: number;
  left: number;
  height: number;
  width: number;
  value: number;
}

export default function CircleFsr({ top, left, height, width, value }: Props) {
  return (
    <CircleFsrContainer height={height} width={width} top={top} left={left}>
      <Text variant='labelLarge' style={{ color: 'white' }}>
        {value}N
      </Text>
    </CircleFsrContainer>
  );
}
