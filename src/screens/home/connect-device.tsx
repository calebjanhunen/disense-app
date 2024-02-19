import React from 'react';
import { Button, PageView, Text } from '../../components';
import Spacer from '../../components/spacer/spacer';
import { useBLE } from '../../context/ble-context';

export default function ConnectDevice() {
  const { stopConnecting, isConnecting, connectToDevice } = useBLE();
  return (
    <PageView>
      <Spacer size='md' />
      <Text variant='smallTitle' textAlign='center'>
        Disense socks not connected
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
