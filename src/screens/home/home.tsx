import React from 'react';
import ConnectDevice from './connect-device';
import DeviceConnected from './device-connected';
import { useBLE } from '../../context/ble-context';

export default function Home(): React.ReactElement {
  const {
    connectToDevice,
    disconnectFromDevice,
    connectedDevice,
    isConnecting,
  } = useBLE();

  return connectedDevice ? (
    <DeviceConnected
      device={connectedDevice}
      disconnect={disconnectFromDevice}
    />
  ) : (
    <ConnectDevice
      isConnecting={isConnecting}
      connectToDevice={connectToDevice}
    />
  );
}
