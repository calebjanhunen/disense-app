import { View, Text, FlatList } from 'react-native';
import React from 'react';

interface Props {
  sensorType: 'thermistor' | 'fsr' | 'spo2';
}

export default function SensorDataTable({ sensorType }: Props) {
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
      <FlatList
        data={[0, 1]}
        renderItem={({ item }) => <Row />}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, borderColor: 'black', borderWidth: 1 }} />
        )}
      />
    </View>
  );
}

function Row() {
  return (
    <View
      style={{
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 7,
        paddingRight: 7,
        flexDirection: 'row',
      }}
    >
      <Text style={{ flex: 1, textAlign: 'center' }}>1</Text>
      <Text style={{ flex: 1, textAlign: 'center' }}>1</Text>
      <Text style={{ flex: 2, textAlign: 'center' }}>12:03</Text>
      <Text style={{ flex: 1, textAlign: 'center' }}>26.8</Text>
    </View>
  );
}
