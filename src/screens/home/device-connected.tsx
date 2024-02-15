import React from 'react';
import { PageView, Spacer, Text } from '../../components';
import ConnectedDeviceHeader from './components/connected-device-header/connected-device-header';
import Spo2DataDisplay from './components/spo2-data-display/spo2-data-display';
import ThermistorDisplay from './components/thermistor-display/thermistor-display';
import FSRDisplay from './components/fsr-display/fsr-display';
import { useSensorData } from '../../context/sensor-context';

export default function DeviceConnected(): React.ReactElement {
  // console.log('SENSOR DATA PAGE RENDERED');
  const { sensorData } = useSensorData();

  return (
    <PageView>
      <Spacer size='lg' />
      <ConnectedDeviceHeader />
      <Spacer size='lg' />
      <Text variant='headline'>Thermistors</Text>
      <ThermistorDisplay thermistorData={sensorData.thermistors} />
      <Spacer size='lg' />
      <Text variant='headline'>FSRs</Text>
      <FSRDisplay fsrData={sensorData.fsr} />
      <Spacer size='lg' />
      <Text variant='headline'>SPO2</Text>
      <Spo2DataDisplay spo2Data={sensorData.spo2} />
    </PageView>
  );
}
