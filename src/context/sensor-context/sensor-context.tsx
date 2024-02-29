import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  bulkInsertIntoFSRTable,
  bulkInsertIntoSPO2Table,
  bulkInsertIntoThermistorTable,
} from '@/db/sensor-interface';
import { FSR, SPO2Sensor, Sensors, Thermistor } from '@/interfaces/Sensor';
import { TestInfoContext } from '../test-info-context';

interface ISensorContext {
  sensorData: Sensors;
  updateSensorData: (
    thermistorData: Thermistor[],
    fsrData: FSR[],
    spo2Data: SPO2Sensor[]
  ) => void;
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

  function updateSensorData(
    thermistorData: Thermistor[],
    fsrData: FSR[],
    spo2Data: SPO2Sensor[]
  ): void {
    const tempSensorData: Sensors = {
      thermistors: new Array(4),
      spo2: new Array(1),
      fsr: new Array(4),
    };
    // Loop through all sensor data and insert into array ensuring it increases with id:
    // arr[0] = id: 1, arr[1] = id: 2, ....
    for (const thermistor of thermistorData) {
      tempSensorData.thermistors[thermistor.id - 1] = thermistor;
    }
    for (const fsr of fsrData) {
      tempSensorData.fsr[fsr.id - 1] = fsr;
    }
    for (const spo2 of spo2Data) {
      tempSensorData.spo2[spo2.id - 1] = spo2;
    }
    setSensorData(tempSensorData);
  }

  return (
    <SensorContext.Provider
      value={{
        sensorData,
        updateSensorData,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}
