import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { FSR, Sensor } from '../interfaces/Sensor';
import { bulkInsertIntoFSRTable } from '../db/sensor-interface';
import { TestInfoContext } from '../context/test-info-context';

interface IUseFSRData {
  fsrData: FSR[];
  setFsrData: Dispatch<SetStateAction<FSR[]>>;
  error: string;
}

export function useFSRData(): IUseFSRData {
  const [fsrData, setFsrData] = useState<FSR[]>([]);
  const [error, setError] = useState<string>('');
  const { user } = useContext(TestInfoContext);

  async function insertFSRData(sensorData: FSR[]) {
    try {
      await bulkInsertIntoFSRTable(sensorData, user);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  }

  return {
    fsrData,
    setFsrData,
    error,
  };
}
