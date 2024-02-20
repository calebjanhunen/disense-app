import { View, Text } from 'react-native';
import React, { memo } from 'react';
import { SensorDB } from '@/db/DBInterfaces';
import SensorList from '../sensor-list/sensor-list';

interface Props {
  sensorType: 'thermistor' | 'fsr' | 'spo2';
  data: SensorDB[];
}

function SensorDataTable({ sensorType, data }: Props) {
  console.log(sensorType, data);
  const valueCol = () => {
    if (sensorType === 'thermistor') {
      return 'Temp';
    } else if (sensorType === 'fsr') {
      return 'Force';
    } else {
      return 'Blood oxygen';
    }
  };

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
        <Text style={{ flex: 1, textAlign: 'center' }}>{valueCol()}</Text>
      </View>
      <SensorList data={data} />
    </View>
  );
}

export default memo(SensorDataTable);
