import React from 'react';
import { Text } from 'react-native';

import { PageView } from '@/components';
import { Spo2InfoScreenProps } from '@/types/navigation-types';

export default function Spo2Info({ route }: Spo2InfoScreenProps) {
  const { spo2Data } = route.params;

  return (
    <PageView>
      <Text>SPO2:</Text>
      <Text>Heart Rate: {spo2Data[0]?.heartRate} bpm</Text>
      <Text>Blood oxygen: {spo2Data[0]?.bloodOxygen}%</Text>
    </PageView>
  );
}
