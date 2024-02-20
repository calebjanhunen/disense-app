import { View, Text } from 'react-native';
import React, { memo } from 'react';
import { SensorDB } from '@/db/DBInterfaces';
import SensorList from '../sensor-list/sensor-list';

interface Props {
  data: SensorDB[];
  noDataText: string;
}

function SensorDataTable({ data, noDataText }: Props) {
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
      {noDataText ? (
        <Text style={{ textAlign: 'center', color: 'red' }}>{noDataText}</Text>
      ) : (
        <SensorList data={data} />
      )}
    </View>
  );
}

export default memo(SensorDataTable);
