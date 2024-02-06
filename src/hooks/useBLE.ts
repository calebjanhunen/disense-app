import { useMemo, useState } from 'react';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  DeviceId,
} from 'react-native-ble-plx';
import { MyBleManager } from '../ble/ble-manager';
import { SPO2Sensors, Sensors } from '../interfaces/Sensor';
import { SensorType } from '../types/sensor-types';
import {
  decodeByteArrForSPO2,
  decodeByteArray,
  fromBase64ToByteArr,
} from '../utils/byte-array-manager';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const THERMISTORS_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const FSR_CHARACTERISTIC_UUID = 'f00a075c-948e-4f01-9cb6-7d876cf96683';
const SPO2_CHARACTERISTIC_UUID = '9f7d8c4f-b3d4-4d72-8787-8386e5f13195';

interface IUseBLE {
  connectToDevice(): Promise<void>;
  disconnectFromDevice(deviceId: DeviceId): Promise<void>;
  connectedDevice: Device | null;
  isConnecting: boolean;
}

export default function useBLE(): IUseBLE {
  const bleManagerV2 = useMemo(() => new MyBleManager(), []);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // TODO: Implement for 2nd sock when set up
  function onDeviceConnected(device1: Device): void {
    setConnectedDevice(device1);
    setIsConnecting(false);
  }

  async function connectToDevice(): Promise<void> {
    setIsConnecting(true);
    try {
      await bleManagerV2.connect(onDeviceConnected);
    } catch (e) {
      console.log('ERRORRRR CONNECTING: ', e);
    }
  }

  async function disconnectFromDevice(): Promise<void> {
    try {
      await bleManagerV2.disconnectFromDevice();
      // TODO: Implement disconnecting from 2nd sock when set up
      setConnectedDevice(null);
    } catch (e) {
      console.log(e);
    }
  }

  return {
    connectedDevice,
    connectToDevice,
    disconnectFromDevice,
    isConnecting,
  };
}

/**
 *   async function getDataFromDevice(device: Device): Promise<void> {
    const services = await device.services();
    const service = services.find(s => s.uuid === SERVICE_UUID);
    if (!service) {
      console.log('Service not found');
      return;
    }
    const characteristics = await service.characteristics();
    for (const characteristic of characteristics) {
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        characteristic.uuid,
        onReadCharacteristic
      );
    }
  }

  function onReadCharacteristic(
    error: BleError | null,
    characteristic: Characteristic | null
  ): void {
    if (error) {
      console.log('Error reading from device: ', error);
      return;
    }
    if (!characteristic) {
      console.log('No characteristic');
      return;
    }

    if (characteristic.value) {
      const sensorType = getSensorType(characteristic.uuid);
      if (!sensorType) {
        console.log('Characeristic does not exist');
        return;
      }

      const byteArr = fromBase64ToByteArr(characteristic.value);
      if (sensorType === 'thermistor' || sensorType === 'fsr') {
        const sensorData = decodeByteArray(byteArr, sensorType);
        if (sensorType === 'thermistor') {
          setThermistorData(sensorData);
        } else {
          setFsrData(sensorData);
        }
      } else {
        const sensorData = decodeByteArrForSPO2(byteArr);
        setSpo2Data(sensorData);
      }
    }
  }
    function getSensorType(characteristicUuid: string): SensorType | null {
    if (characteristicUuid === THERMISTORS_CHARACTERISTIC_UUID) {
      return 'thermistor';
    } else if (characteristicUuid === SPO2_CHARACTERISTIC_UUID) {
      return 'spo2';
    } else if (characteristicUuid === FSR_CHARACTERISTIC_UUID) {
      return 'fsr';
    } else {
      return null;
    }
  }
 */
