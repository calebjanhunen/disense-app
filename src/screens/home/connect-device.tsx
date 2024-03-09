import React from 'react';
import { Button, Text } from 'react-native-paper';

import { PageView } from '@/components';
import Spacer from '@/components/spacer/spacer';
import { useBLE } from '@/context/ble-context';

export default function ConnectDevice() {
  const { stopConnecting, isConnecting, connectToDevice } = useBLE();
  return (
    <PageView>
      <Spacer size='md' />
      <Text variant='headlineSmall' style={{ textAlign: 'center' }}>
        Disense socks not connected
      </Text>
      <Spacer size='xs' />
      <Text variant='bodyLarge' style={{ textAlign: 'center' }}>
        Ensure the sock is on and connect via Bluetooth
      </Text>

      <Spacer size='md' />
      <Button
        mode='contained'
        onPress={isConnecting ? stopConnecting : async () => connectToDevice()}
      >
        {isConnecting ? 'Stop Connecting' : 'Connect to Socks'}
      </Button>
    </PageView>
  );
}
