import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TestInfoContext } from '../context/test-info-context';
import { bulkInsertIntoThermistorTable } from '../db/sensor-interface';
import { Sensor, Sensors } from '../interfaces/Sensor';

interface IUseThermistorData {
  error: string | null;
  setThermistorData: Dispatch<SetStateAction<Sensors | undefined>>;
  thermistorData: Sensors | undefined;
}

export function useThermistorData(): IUseThermistorData {
  const { user } = useContext(TestInfoContext);
  const [thermistorData, setThermistorData] = useState<Sensors>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('user in thermistor data hook: ', user);
    if (thermistorData) {
      insert(thermistorData.sensors);
    }
  }, [thermistorData]);

  async function insert(sensors: Sensor[]): Promise<void> {
    setError(null);
    try {
      await bulkInsertIntoThermistorTable(sensors, user);
    } catch (e) {
      console.log(e);
      if (e instanceof Error) setError(e.message);
    }
  }

  return {
    error,
    setThermistorData,
    thermistorData,
  };
}
