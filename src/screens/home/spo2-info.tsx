import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

import { PageView } from '@/components';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSensorData } from '@/context/sensor-context/sensor-context';

export default function Spo2Info() {
  const { spo2Data } = useSensorData();

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
              {spo2Data[0]?.heartRate}
            </Text>
            <View>
              <Ionicons name='heart' color='red' size={20} />
              <Text variant='labelLarge'>BPM</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              variant='displayLarge'
              style={{ fontWeight: 'bold', color: 'green' }}
            >
              {spo2Data[0]?.bloodOxygen}
            </Text>
            <View>
              <Ionicons name='water-sharp' color='red' size={20} />
              <Text variant='labelLarge'>%</Text>
            </View>
          </View>
        </View>
      </View>
    </PageView>
  );
}
