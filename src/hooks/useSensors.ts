import { useState } from 'react';
import { Base64 } from 'react-native-ble-plx';
import { Sensors } from '../interfaces/Sensor';
import { SensorType } from '../types/sensor-types';
import {
  decodeByteArray,
  fromBase64ToByteArr,
} from '../utils/byte-array-manager';

interface IUseSensors {
  thermistorData: Sensors | undefined;
  fsrData: Sensors | undefined;
  spo2Data: Sensors | undefined;
  setSensorData(base64String: Base64, sensorType: SensorType): void;
}

export function useSensors(): IUseSensors {
  const [thermistorData, setThermistorData] = useState<Sensors>();
  const [fsrData, setFsrData] = useState<Sensors>();
  const [spo2Data, setSpo2Data] = useState<Sensors>();
  console.log('thermistor data before: ', thermistorData);
  function setSensorData(base64String: Base64, sensorType: SensorType) {
    const byteArr = fromBase64ToByteArr(base64String);
    const sensorData = decodeByteArray(byteArr, sensorType);
    // console.log('sensorData: ', sensorData);
    if (sensorData.type === 'thermistor') {
      setThermistorData(sensorData);
    }
    // console.log('ThermistorData: ', thermistorData);
  }

  return {
    thermistorData,
    fsrData,
    spo2Data,
    setSensorData,
  };
}
