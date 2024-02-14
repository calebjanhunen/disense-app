import base64 from 'react-native-base64';
import { FSR, SPO2Sensor, Thermistor } from '../interfaces/Sensor';
import { Base64 } from 'react-native-ble-plx';

export function decodeByteArrayForThermistor(
  byteArr: Uint8Array
): Thermistor[] {
  const sensorData: Thermistor[] = [];

  for (let i = 0; i < byteArr.length; i += 5) {
    const id = byteArr[i];
    const decodedVal =
      (byteArr[i + 1] << 24) |
      (byteArr[i + 2] << 16) |
      (byteArr[i + 3] << 8) |
      byteArr[i + 4];

    sensorData.push({
      id,
      temp: decodedVal / 10, // divide by 10 since value is sent as integer (val * 10)
    });
  }

  return sensorData;
}

export function decodeByteArrayForFSR(byteArr: Uint8Array): FSR[] {
  const sensorData: FSR[] = [];

  for (let i = 0; i < byteArr.length; i += 5) {
    const id = byteArr[i];
    const decodedVal =
      (byteArr[i + 1] << 24) |
      (byteArr[i + 2] << 16) |
      (byteArr[i + 3] << 8) |
      byteArr[i + 4];

    sensorData.push({
      id,
      force: decodedVal / 10, // divide by 10 since value is sent as integer (val * 10)
    });
  }

  return sensorData;
}

export function decodeByteArrForSPO2(byteArr: Uint8Array): SPO2Sensor[] {
  const spo2Data: SPO2Sensor[] = [];

  for (let i = 0; i < byteArr.length; i += 5) {
    const id = byteArr[i];
    const heartRate = byteArr[i + 1] | byteArr[i + 2];
    const bloodOxygen = byteArr[i + 3] | byteArr[i + 4];
    spo2Data.push({
      id,
      heartRate,
      bloodOxygen,
    });
  }

  return spo2Data;
}

/**
 * Converts base64 string read by react-native-ble-plx characteristic into byte array
 * @param base64String - Base64 string
 * @returns The byte array
 */
export function fromBase64ToByteArr(base64String: Base64): Uint8Array {
  const decodedString = base64.decode(base64String);
  const byteArr = new Uint8Array(new ArrayBuffer(decodedString.length));

  for (let i = 0; i < decodedString.length; i++) {
    byteArr[i] = decodedString.charCodeAt(i);
  }
  // console.log(byteArr);

  return byteArr;
}
