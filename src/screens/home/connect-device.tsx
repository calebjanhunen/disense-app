import React from 'react';
import { FlatList } from 'react-native';
import { Device, DeviceId } from 'react-native-ble-plx';
import { Button, PageView, Text } from '../../components';
import Spacer from '../../components/spacer/spacer';
import AvailableDeviceCard from './components/available-device-card/available-device-card';

interface Props {
  scanForPeripherals(): void;
  connectToDevice(deviceId: DeviceId): Promise<void>;
  stopScanning(): void;
  isScanning: boolean;
  allDevices: Device[];
}

export default function ConnectDevice({
  scanForPeripherals,
  connectToDevice,
  stopScanning,
  isScanning,
  allDevices,
}: Props) {
  async function startOrStopScanning(): Promise<void> {
    if (isScanning) {
      stopScanning();
    } else {
      scanForPeripherals();
    }
  }
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
        onPress={startOrStopScanning}
      >
        {isScanning ? 'Stop scanning' : 'Scan for devices'}
      </Button>
      <Spacer size='lg' />
      <Text variant='title'>Available Devices</Text>
      <Spacer size='sm' />

      <FlatList
        style={{ width: '100%', flex: 1 }}
        data={allDevices}
        renderItem={({ item }) => (
          <AvailableDeviceCard
            device={item}
            connectToDevice={connectToDevice}
          />
        )}
        ItemSeparatorComponent={() => <Spacer size='md' />}
      />
    </PageView>
  );
}
