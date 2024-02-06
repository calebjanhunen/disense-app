import React from 'react';
import { FlatList } from 'react-native';
import { Device, DeviceId } from 'react-native-ble-plx';
import { PageView, Spacer, Text } from '../../components';
import { SPO2Sensors, Sensors } from '../../interfaces/Sensor';
import ConnectedDeviceHeader from './components/connected-device-header/connected-device-header';
import SensorDisplay from './components/sensor-display/sensor-display';
import Spo2DataDisplay from './components/spo2-data-display/spo2-data-display';

interface Props {
  device: Device;
  disconnect(deviceId: DeviceId): Promise<void>;
  thermistorData: Sensors | undefined;
  fsrData: Sensors | undefined;
  spo2Data: SPO2Sensors | undefined;
}

export default function DeviceConnected({
  device,
  disconnect,
  thermistorData,
  fsrData,
  spo2Data,
}: Props): React.ReactElement {
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
        data={thermistorData?.sensors}
        renderItem={({ item }) => (
          <SensorDisplay sensor={item} type={thermistorData?.type} />
        )}
      />
      <Spacer size='lg' />
      <Text variant='headline'>FSRs</Text>
      <FlatList
        data={fsrData?.sensors}
        renderItem={({ item }) => (
          <SensorDisplay sensor={item} type={fsrData?.type} />
        )}
      />

      <Spacer size='lg' />
      <Text variant='headline'>SPO2</Text>
      <FlatList
        data={spo2Data?.sensors}
        renderItem={({ item }) => <Spo2DataDisplay sensor={item} />}
      />
    </PageView>
  );
}
