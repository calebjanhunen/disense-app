import base64 from 'react-native-base64';
import { Base64 } from 'react-native-ble-plx';
import { SPO2Sensors, Sensors } from '../interfaces/Sensor';
import { SensorType } from '../types/sensor-types';

/**
 * Decodes byte array into readable numbers (sensor id & sensor reading)
 * @param byteArr - Byte array read by BLE
 * @return The object containing the sensor data
 */
export function decodeByteArray(
  byteArr: Uint8Array,
  sensorType: SensorType
): Sensors {
  const sensorData: Sensors = {
    type: sensorType,
    sensors: [],
  };

  for (let i = 0; i < byteArr.length; i += 5) {
    const id = byteArr[i];
    const decodedVal =
      (byteArr[i + 1] << 24) |
      (byteArr[i + 2] << 16) |
      (byteArr[i + 3] << 8) |
      byteArr[i + 4];

    sensorData.sensors.push({
      id,
      value: decodedVal / 10, // divide by 10 since value is sent as integer (val * 10)
    });
  }

  return sensorData;
}

export function decodeByteArrForSPO2(byteArr: Uint8Array): SPO2Sensors {
  const spo2Data: SPO2Sensors = {
    sensors: [],
  };

  for (let i = 0; i < byteArr.length; i += 5) {
    const id = byteArr[i];
    const heartRate = byteArr[i + 1] | byteArr[i + 2];
    const bloodOxygen = byteArr[i + 3] | byteArr[i + 4];
    spo2Data.sensors.push({
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
