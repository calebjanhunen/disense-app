import React from 'react';
import { FlatList } from 'react-native';
import { Device, DeviceId } from 'react-native-ble-plx';
import { PageView, Spacer, Text } from '../../components';
import ConnectedDeviceHeader from './components/connected-device-header/connected-device-header';
import Spo2DataDisplay from './components/spo2-data-display/spo2-data-display';
import { useBLE } from '../../context/ble-context';
import ThermistorDisplay from './components/thermistor-display/thermistor-display';
import FSRDisplay from './components/fsr-display/fsr-display';
import { useFSRData } from '../../hooks/useFSRData';
import { useThermistorData } from '../../hooks/useThermistorData';

interface Props {
  device: Device;
  disconnect(deviceId: DeviceId): Promise<void>;
}

export default function DeviceConnected({
  device,
  disconnect,
}: Props): React.ReactElement {
  const { thermistorData } = useThermistorData();
  const { fsrData } = useFSRData();
  const { spo2Data } = useBLE();

  console.log('Thermistor data in component: ', thermistorData);

  return (
    <PageView>
      <Spacer size='lg' />
      <ConnectedDeviceHeader
        device={device}
        disconnectFromDevice={disconnect}
      />
      <Spacer size='lg' />
      <Text variant='headline'>Thermistors</Text>
      <FlatList
        data={thermistorData}
        renderItem={({ item }) => <ThermistorDisplay sensor={item} />}
      />
      <Spacer size='lg' />
      <Text variant='headline'>FSRs</Text>
      <FlatList
        data={fsrData}
        renderItem={({ item }) => <FSRDisplay sensor={item} />}
      />
      <Spacer size='lg' />
      <Text variant='headline'>SPO2</Text>
      <FlatList
        data={spo2Data}
        renderItem={({ item }) => <Spo2DataDisplay sensor={item} />}
      />
    </PageView>
  );
}
