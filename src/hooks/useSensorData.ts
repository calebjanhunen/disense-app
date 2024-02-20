import { TestInfoContext } from '@/context/test-info-context';
import { SensorDB } from '@/db/DBInterfaces';
import {
  getFsrDataForUserV2,
  getSpo2DataForUserV2,
  getThermistorDataForUserV2,
} from '@/db/sensor-interface';
import { SensorType } from '@/types/sensor-types';
import { useContext, useState } from 'react';

interface IUseSensorData {
  getSensorData: (sensorType: SensorType) => Promise<void>;
  sensorData: SensorDB[];
  noDataText: string;
}

export function useSensorData(): IUseSensorData {
  const [sensorData, setSensorData] = useState<SensorDB[]>([]);
  const [noDataText, setNoDataText] = useState<string>('');
  const { user } = useContext(TestInfoContext);

  async function getSensorData(sensorType: SensorType): Promise<void> {
    if (!user) {
      console.log('no user');
      return;
    }
    let data;
    setSensorData([]);
    if (sensorType === 'thermistor') {
      data = await getThermistorDataForUserV2(user, 'created_at', 'DESC', 20);
    } else if (sensorType === 'fsr') {
      data = await getFsrDataForUserV2(user, 'created_at', 'DESC', 20);
    } else {
      data = await getSpo2DataForUserV2(user, 'created_at', 'DESC', 20);
    }
    if (!data || data.length === 0) {
      setNoDataText(`User ${user} has no data for ${sensorType}`);
      return;
    }
    setSensorData(data);
  }

  return { getSensorData, sensorData, noDataText };
}
