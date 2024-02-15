import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FSR, SPO2Sensor, Sensors, Thermistor } from '../interfaces/Sensor';
import { TestInfoContext } from './test-info-context';
import {
  bulkInsertIntoFSRTable,
  bulkInsertIntoSPO2Table,
  bulkInsertIntoThermistorTable,
} from '../db/sensor-interface';

interface ISensorContext {
  sensorData: Sensors;
  setSensorData: Dispatch<SetStateAction<Sensors>>;
}

interface Props {
  children: React.ReactNode;
}

const SensorContext = createContext<ISensorContext>({} as ISensorContext);

export const useSensorData = () => useContext(SensorContext);

export function SensorContextProvider({ children }: Props) {
  const [sensorData, setSensorData] = useState<Sensors>({
    thermistors: [],
    spo2: [],
    fsr: [],
  });
  const { user, isTestRunning } = useContext(TestInfoContext);
  useEffect(() => {
    if (isTestRunning) {
      sensorData.thermistors && insertThermistorData(sensorData.thermistors);
      sensorData.fsr && insertFsrData(sensorData.fsr);
      sensorData.spo2 && insertSpo2Data(sensorData.spo2);
    }
  }, [sensorData]);

  async function insertThermistorData(
    thermistorData: Thermistor[]
  ): Promise<void> {
    await bulkInsertIntoThermistorTable(thermistorData, user);
  }

  async function insertFsrData(fsrData: FSR[]): Promise<void> {
    await bulkInsertIntoFSRTable(fsrData, user);
  }

  async function insertSpo2Data(spo2Data: SPO2Sensor[]): Promise<void> {
    await bulkInsertIntoSPO2Table(spo2Data, user);
  }

  return (
    <SensorContext.Provider
      value={{
        sensorData,
        setSensorData,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}
