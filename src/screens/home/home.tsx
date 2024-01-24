import React from 'react';
import { FlatList } from 'react-native';
import { Button, PageView, Text } from '../../components';
import Spacer from '../../components/spacer/spacer';
import useBLE from '../../hooks/useBLE';
import AvailableDeviceCard from './components/available-device-card/available-device-card';
import ConnectedDeviceCard from './components/connected-device-card/connected-device-card';

export default function Home(): React.ReactElement {
  const {
    scanForPeripherals,
    allDevices,
    isScanning,
    stopScanning,
    connectToDevice,
    connectedDevices,
    disconnectFromDevice,
    temp,
  } = useBLE();

  async function startOrStopScanning(): Promise<void> {
    if (isScanning) {
      stopScanning();
    } else {
      scanForPeripherals();
    }
  }

  return (
    <PageView>
      <Spacer size="md" />
      {temp && <Text variant="headline">Temp: {temp}</Text>}
      <Button
        variant="full"
        backgroundColor="primary"
        textColor="white"
        onPress={startOrStopScanning}
      >
        {isScanning ? 'Stop scanning' : 'Scan for devices'}
      </Button>
      <Spacer size="lg" />
      {connectedDevices.length > 0 && (
        <>
          <Text variant="title">Connected Devices</Text>
          <FlatList
            style={{ width: '100%' }}
            data={connectedDevices}
            renderItem={({ item }) => (
              <ConnectedDeviceCard
                device={item}
                disconnectFromDevice={disconnectFromDevice}
              />
            )}
            ItemSeparatorComponent={() => <Spacer size="md" />}
          />
        </>
      )}
      {/* <Spacer size="lg" /> */}
      <Text variant="title">Available Devices</Text>
      <Spacer size="sm" />

      <FlatList
        style={{ width: '100%', flex: 1 }}
        data={allDevices}
        renderItem={({ item }) => (
          <AvailableDeviceCard
            device={item}
            connectToDevice={connectToDevice}
          />
        )}
        ItemSeparatorComponent={() => <Spacer size="md" />}
      />
    </PageView>
  );
}
