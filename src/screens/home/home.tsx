import React from 'react';
import useBLE from '../../hooks/useBLE';
import ConnectDevice from './connect-device';
import DeviceConnected from './device-connected';

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
      thermistorData={undefined}
      fsrData={undefined}
      spo2Data={undefined}
    />
  ) : (
    <ConnectDevice
      isConnecting={isConnecting}
      connectToDevice={connectToDevice}
    />
  );
}
