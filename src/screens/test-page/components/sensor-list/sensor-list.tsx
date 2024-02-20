import React, { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';

import { SensorDB } from '@/db/DBInterfaces';

interface Props {
  data: SensorDB[];
}

export default function SensorList({ data }: Props) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View
          style={{
            paddingTop: 7,
            paddingBottom: 7,
            paddingLeft: 7,
            paddingRight: 7,
            flexDirection: 'row',
          }}
        >
          <Text style={{ flex: 1, textAlign: 'center' }}>{item.id}</Text>
          <Text style={{ flex: 1, textAlign: 'center' }}>{item.sensorId}</Text>
          <Text style={{ flex: 2, textAlign: 'center' }}>
            {item.createdAt.toString()}
          </Text>
          <Text style={{ flex: 1, textAlign: 'center' }}>{item.value}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, borderColor: 'black', borderWidth: 1 }} />
      )}
    />
  );
}
