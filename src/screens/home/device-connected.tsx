import React from 'react';
import { FlatList } from 'react-native';
import { Device, DeviceId } from 'react-native-ble-plx';
import { PageView, Spacer, Text } from '../../components';
import { Sensors } from '../../interfaces/Sensor';
import ConnectedDeviceHeader from './components/connected-device-header/connected-device-header';
import SensorDisplay from './components/sensor-display/sensor-display';

interface Props {
  device: Device;
  disconnect(deviceId: DeviceId): Promise<void>;
  thermistorData: Sensors | undefined;
  fsrData: Sensors | undefined;
}

export default function DeviceConnected({
  device,
  disconnect,
  thermistorData,
  fsrData,
}: Props): React.ReactElement {
  return (
    <PageView>
      <Spacer size='lg' />
      <ConnectedDeviceHeader
        device={device}
        disconnectFromDevice={disconnect}
      />
      <Spacer size='lg' />
      <Text variant='headline'>Thermistors</Text>
      <FlatList
        data={thermistorData?.sensors}
        renderItem={({ item }) => (
          <SensorDisplay sensor={item} type={thermistorData?.type} />
        )}
      />
      <Spacer size='lg' />
      <Text variant='headline'>FSRs</Text>
      <FlatList
        data={fsrData?.sensors}
        renderItem={({ item }) => (
          <SensorDisplay sensor={item} type={fsrData?.type} />
        )}
      />
    </PageView>
  );
}
