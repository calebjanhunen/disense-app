import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TestInfoContext } from '../context/test-info-context';
import { bulkInsertIntoThermistorTable } from '../db/sensor-interface';
import { Thermistor } from '../interfaces/Sensor';

interface IUseThermistorData {
  error: string | null;
  setThermistorData: Dispatch<SetStateAction<Thermistor[]>>;
  thermistorData: Thermistor[];
}

export function useThermistorData(): IUseThermistorData {
  const { user } = useContext(TestInfoContext);
  const [thermistorData, setThermistorData] = useState<Thermistor[]>([]);
  const [error, setError] = useState<string | null>(null);
  console.log('thermistor data in hook: ', thermistorData);
  useEffect(() => {
    if (thermistorData) {
      // insert(thermistorData);
    }
  }, [thermistorData]);

  async function insert(sensors: Thermistor[]): Promise<void> {
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
