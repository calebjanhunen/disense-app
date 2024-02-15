import React from 'react';
import { Button, Text } from '../../../../components';
import { Container, DeviceInfo } from './connected-device-header.styles';
import { useBLE } from '../../../../context/ble-context';

export default function ConnectedDeviceHeader(): React.ReactElement {
  const { disconnectFromDevice } = useBLE();
  return (
    <Container>
      <DeviceInfo>
        <Text variant='title'>Disense Socks</Text>
      </DeviceInfo>
      <Button
        variant='small'
        backgroundColor='primary'
        textColor='white'
        onPress={() => {
          disconnectFromDevice();
        }}
      >
        Disconnect
      </Button>
    </Container>
  );
}
