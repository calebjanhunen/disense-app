import React from 'react';
import { FlatList } from 'react-native';
import { Device, DeviceId } from 'react-native-ble-plx';
import { PageView, Spacer } from '../../components';
import { Sensors } from '../../interfaces/Sensor';
import ConnectedDeviceHeader from './components/connected-device-header/connected-device-header';
import SensorDisplay from './components/sensor-display/sensor-display';

interface Props {
  device: Device;
  disconnect(deviceId: DeviceId): Promise<void>;
  thermistorData: Sensors | undefined;
}

export default function DeviceConnected({
  device,
  disconnect,
  thermistorData,
}: Props): React.ReactElement {
  return (
    <PageView>
      <Spacer size='lg' />
      <ConnectedDeviceHeader
        device={device}
        disconnectFromDevice={disconnect}
      />
      <Spacer size='lg' />
      <FlatList
        data={thermistorData?.sensors}
        renderItem={({ item }) => <SensorDisplay sensor={item} />}
      />
    </PageView>
  );
}
