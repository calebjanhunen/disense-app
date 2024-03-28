import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

import { PageView, Spacer } from '@/components';
import { Spo2InfoScreenProps } from '@/types/navigation-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function Spo2Info({ route }: Spo2InfoScreenProps) {
  const { spo2Data } = route.params;

  return (
    <PageView>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <View style={{ alignItems: 'flex-end', gap: 50 }}>
          <Text
            variant='headlineSmall'
            style={{ marginTop: 14, fontWeight: 'bold' }}
          >
            Heart Rate
          </Text>
          <Text variant='headlineSmall' style={{ fontWeight: 'bold' }}>
            Blood Oxygen
          </Text>
        </View>

        <View style={{ alignItems: 'flex-start', gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              variant='displayLarge'
              style={{ fontWeight: 'bold', color: 'green' }}
            >
              {spo2Data[0]?.heartRate || 'NaN'}
            </Text>
            <View>
              <Ionicons name='heart' color='red' size={20} />
              <Text variant='labelLarge'>{spo2Data[0]?.heartRate} BPM</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              variant='displayLarge'
              style={{ fontWeight: 'bold', color: 'green' }}
            >
              {spo2Data[0]?.bloodOxygen || 'NaN'}
            </Text>
            <View>
              <Ionicons name='water-sharp' color='red' size={20} />
              <Text variant='labelLarge'>{spo2Data[0]?.heartRate} %</Text>
            </View>
          </View>
        </View>
      </View>
    </PageView>
  );
}
