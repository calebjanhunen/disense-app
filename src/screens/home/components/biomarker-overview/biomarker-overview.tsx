import { PressureIcon } from '@/components';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text } from 'react-native-paper';
import { Container, Left } from './biomarker-overview.styles';

interface Props {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  text: 'Temperature' | 'Blood Oxygen' | 'Pressure';
}

export default function BiomarkerOverview({ onPress, icon, text }: Props) {
  return (
    <Container onPress={onPress}>
      <Left>
        {icon ? <Ionicons name={icon} size={60} /> : <PressureIcon />}

        <Text variant='headlineMedium' style={{ fontWeight: 'bold' }}>
          {text}
        </Text>
      </Left>
      <Ionicons name='chevron-forward-outline' size={24} />
    </Container>
  );
}
