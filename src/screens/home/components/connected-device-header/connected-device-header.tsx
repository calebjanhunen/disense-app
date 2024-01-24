import React from 'react';
import { Device, DeviceId } from 'react-native-ble-plx';
import { Button, Text } from '../../../../components';
import { Container, DeviceInfo } from './connected-device-header.styles';

interface AvailableDeviceCardProps {
  device: Device;
  disconnectFromDevice(deviceId: DeviceId): Promise<void>;
}

export default function ConnectedDeviceHeader({
  device,
  disconnectFromDevice,
}: AvailableDeviceCardProps): React.ReactElement {
  return (
    <Container>
      <DeviceInfo>
        <Text variant="title">Disense Socks</Text>
      </DeviceInfo>
      <Button
        variant="small"
        backgroundColor="primary"
        textColor="white"
        onPress={() => {
          disconnectFromDevice(device.id);
        }}
      >
        Disconnect
      </Button>
    </Container>
  );
}
