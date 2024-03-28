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
import { checkThermistorsForUlcerRisk } from '@/utils/temperature-ulcer-risk-functions/thermistor-ulcer-risk-checker';
import { checkPressureForUlcerRisk } from '@/utils/pressure-ulcer-risk-functions/pressure-ulcer-risk-checker';
import { checkSpo2ForUlcerRisk } from '@/utils/spo2-ulcer-risk-functions/spo2-ulcer-risk-checker';

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
    thermistors: [
      { id: 1, temp: 36.7 },
      { id: 2, temp: 33.9 },
      { id: 3, temp: 33.9 },
      { id: 4, temp: 33.9 },
    ],
    fsr: [
      { id: 1, force: 800 },
      { id: 2, force: 820 },
      { id: 3, force: 910 },
      { id: 4, force: 739 },
    ],
  });
  const [spo2Data, setSpo2Data] = useState<SPO2Sensor[]>([
    { id: 1, heartRate: 70, bloodOxygen: 93 },
  ]);
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

    const atRiskThermistors = checkThermistorsForUlcerRisk(thermistorData);
    const isPressureAtRisk = checkPressureForUlcerRisk(fsrData,);
  }

  function updateSpo2Data(spo2Data: SPO2Sensor[]): void {
    setSpo2Data(spo2Data);
    const atRiskThermistors = checkSpo2ForUlcerRisk(spo2Data);
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
