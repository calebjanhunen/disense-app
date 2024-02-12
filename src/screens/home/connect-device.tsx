import React from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Device, DeviceId } from 'react-native-ble-plx';
import { Button, PageView, Text } from '../../components';
import Spacer from '../../components/spacer/spacer';
import AvailableDeviceCard from './components/available-device-card/available-device-card';
import { useBLE } from '../../context/ble-context';

interface Props {
  connectToDevice(): Promise<void>;
  isConnecting: boolean;
}

export default function ConnectDevice({
  connectToDevice,
  isConnecting,
}: Props) {
  const { stopConnecting } = useBLE();
  return (
    <PageView>
      <Spacer size='md' />
      <Text variant='smallTitle' textAlign='center'>
        Disense Device not Connected
      </Text>
      <Spacer size='md' />
      <Button
        variant='full'
        backgroundColor='primary'
        textColor='white'
        onPress={isConnecting ? stopConnecting : async () => connectToDevice()}
      >
        {isConnecting ? 'Stop Connecting' : 'Connect to Socks'}
      </Button>
    </PageView>
  );
}
