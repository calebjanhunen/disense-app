import HomeScreenNavigation from '@/navigation/home-screen-navigation';
import React from 'react';
import { useBLE } from '../../context/ble-context';
import ConnectDevice from './connect-device';
import DeviceConnected from './device-connected';

export default function Home(): React.ReactElement {
  const { connectedDevice } = useBLE();

  // return connectedDevice ? <DeviceConnected /> : <ConnectDevice />;
  return <HomeScreenNavigation />;
}
