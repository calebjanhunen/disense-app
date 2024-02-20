import { View, Text } from 'react-native';
import React, { memo } from 'react';
import { SensorDB } from '@/db/DBInterfaces';
import SensorList from '../sensor-list/sensor-list';

interface Props {
  sensorType: 'thermistor' | 'fsr' | 'spo2';
  data: SensorDB[];
}

function SensorDataTable({ data }: Props) {
  return (
    <View
      style={{
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      >
        <Text style={{ flex: 1, textAlign: 'center' }}>ID</Text>
        <Text style={{ flex: 1, textAlign: 'center' }}>Sensor ID</Text>
        <Text style={{ flex: 2, textAlign: 'center' }}>Time</Text>
        <Text style={{ flex: 1, textAlign: 'center' }}>Value</Text>
      </View>
      <SensorList data={data} />
    </View>
  );
}

export default memo(SensorDataTable);
