import React from 'react';
import { Device, DeviceId } from 'react-native-ble-plx';
import { PageView, Spacer } from '../../components';
import ConnectedDeviceHeader from './components/connected-device-header/connected-device-header';

interface Props {
  device: Device;
  disconnect(deviceId: DeviceId): Promise<void>;
}

export default function DeviceConnected({
  device,
  disconnect,
}: Props): React.ReactElement {
  return (
    <PageView>
      <Spacer size="lg" />
      <ConnectedDeviceHeader
        device={device}
        disconnectFromDevice={disconnect}
      />
    </PageView>
  );
}
