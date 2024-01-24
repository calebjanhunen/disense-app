import React from 'react';
import { Device, DeviceId } from 'react-native-ble-plx';
import { Button, Text } from '../../../../components';
import { Container, DeviceInfo } from './available-device-card.styles';

interface AvailableDeviceCardProps {
  device: Device;
  connectToDevice(deviceId: DeviceId): Promise<void>;
}

export default function AvailableDeviceCard({
  device,
  connectToDevice,
}: AvailableDeviceCardProps): React.ReactElement {
  return (
    <Container>
      <DeviceInfo>
        <Text variant="body">Name: {device.name}</Text>
        <Text variant="body">ID: {device.id}</Text>
      </DeviceInfo>
      <Button
        variant="small"
        backgroundColor="primary"
        textColor="white"
        onPress={() => {
          connectToDevice(device.id);
        }}
      >
        Connect
      </Button>
    </Container>
  );
}
