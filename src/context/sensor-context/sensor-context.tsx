import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  bulkInsertIntoFSRTable,
  bulkInsertIntoSPO2Table,
  bulkInsertIntoThermistorTable,
} from '@/db/sensor-interface';
import {
  AnalogSensors,
  FSR,
  SPO2Sensor,
  Thermistor,
} from '@/interfaces/Sensor';
import { TestInfoContext } from '../test-info-context';

interface ISensorContext {
  sensorData: AnalogSensors;
  spo2Data: SPO2Sensor[];
  updateThermistorAndFsrData: (
    thermistorData: Thermistor[],
    fsrData: FSR[]
  ) => void;
  updateSpo2Data: (spo2Data: SPO2Sensor[]) => void;
}

interface Props {
  children: React.ReactNode;
}

const SensorContext = createContext<ISensorContext>({} as ISensorContext);

export const useSensorData = () => useContext(SensorContext);

export function SensorContextProvider({ children }: Props) {
  const [sensorData, setSensorData] = useState<AnalogSensors>({
    thermistors: [],
    fsr: [],
  });
  const [spo2Data, setSpo2Data] = useState<SPO2Sensor[]>([]);
  const { user, isTestRunning } = useContext(TestInfoContext);
  useEffect(() => {
    if (isTestRunning) {
      sensorData.thermistors && insertThermistorData(sensorData.thermistors);
      sensorData.fsr && insertFsrData(sensorData.fsr);
    }
  }, [sensorData]);

  useEffect(() => {
    spo2Data.length > 0 &&
      spo2Data[0].bloodOxygen !== 0 &&
      insertSpo2Data(spo2Data);
  }, [spo2Data]);

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

  function updateThermistorAndFsrData(
    thermistorData: Thermistor[],
    fsrData: FSR[]
  ): void {
    const tempSensorData: AnalogSensors = {
      thermistors: new Array(4),
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
    setSensorData(tempSensorData);
  }

  function updateSpo2Data(spo2Data: SPO2Sensor[]): void {
    setSpo2Data(spo2Data);
  }

  return (
    <SensorContext.Provider
      value={{
        sensorData,
        spo2Data,
        updateThermistorAndFsrData,
        updateSpo2Data,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}
