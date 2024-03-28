import HomeScreenNavigation from '@/navigation/home-screen-navigation';
import React from 'react';
import { useBLE } from '../../context/ble-context';
import ConnectDevice from './connect-device';

export default function Home(): React.ReactElement {
  const { connectedDevice } = useBLE();

  return connectedDevice ? <HomeScreenNavigation /> : <ConnectDevice />;
  // return <HomeScreenNavigation />;
}
