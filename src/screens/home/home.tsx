import React from 'react';
import ConnectDevice from './connect-device';
import DeviceConnected from './device-connected';
import { useBLE } from '../../context/ble-context';

export default function Home(): React.ReactElement {
  const { connectedDevice } = useBLE();

  console.log('HOME PAGE RENDERED');

  return connectedDevice ? <DeviceConnected /> : <ConnectDevice />;
}
