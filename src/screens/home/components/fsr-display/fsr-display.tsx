import React from 'react';
import { Text } from '../../../../components';
import { Container } from './fsr-display.styles';
import { FlatList } from 'react-native';
import { FSR } from '../../../../interfaces/Sensor';

interface Props {
  fsrData: FSR[];
}

export default function FSRDisplay({ fsrData }: Props) {
  // console.log('FSR component RENDERED');
  return (
    <FlatList
      data={fsrData}
      renderItem={({ item }) => (
        <Container>
          <Text variant='body'>ID: {item.id}</Text>
          <Text variant='body'>|</Text>
          <Text variant='body'>Force: {item.force}</Text>
        </Container>
      )}
    />
  );
}
