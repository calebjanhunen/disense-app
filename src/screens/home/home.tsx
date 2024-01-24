import React from 'react';
import useBLE from '../../hooks/useBLE';
import ConnectDevice from './connect-device';
import DeviceConnected from './device-connected';

export default function Home(): React.ReactElement {
  const {
    scanForPeripherals,
    allDevices,
    isScanning,
    stopScanning,
    connectToDevice,
    disconnectFromDevice,
    connectedDevice,
    thermistorData,
  } = useBLE();

  return connectedDevice ? (
    <DeviceConnected
      device={connectedDevice}
      disconnect={disconnectFromDevice}
      thermistorData={thermistorData}
    />
  ) : (
    <ConnectDevice
      scanForPeripherals={scanForPeripherals}
      allDevices={allDevices}
      isScanning={isScanning}
      stopScanning={stopScanning}
      connectToDevice={connectToDevice}
    />
  );
}