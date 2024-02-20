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
}

export function useSensorData(): IUseSensorData {
  const [sensorData, setSensorData] = useState<SensorDB[]>([]);
  const { user } = useContext(TestInfoContext);

  async function getSensorData(sensorType: SensorType): Promise<void> {
    // if (!user) {
    //   console.log('no user');
    //   return;
    // }
    let data;
    setSensorData([]);
    if (sensorType === 'thermistor') {
      data = await getThermistorDataForUserV2(2, 'created_at', 'DESC');
    } else if (sensorType === 'fsr') {
      data = await getFsrDataForUserV2(2, 'created_at', 'DESC');
    } else {
      data = await getSpo2DataForUserV2(2, 'created_at', 'DESC');
    }
    if (!data) {
      console.log('no data');
      return [];
    }
    setSensorData(data);
  }

  return { getSensorData, sensorData };
}
