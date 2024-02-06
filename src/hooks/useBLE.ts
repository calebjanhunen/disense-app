import { useMemo, useState } from 'react';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  DeviceId,
} from 'react-native-ble-plx';
import { PermissionManager } from '../ble/permission-manager';
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
  scanForPeripherals(): void;
  connectToDevice(deviceId: DeviceId): Promise<void>;
  disconnectFromDevice(deviceId: DeviceId): Promise<void>;
  stopScanning(): void;
  allDevices: Device[];
  connectedDevice: Device | null;
  isScanning: boolean;
  thermistorData: Sensors | undefined;
  fsrData: Sensors | undefined;
  spo2Data: SPO2Sensors | undefined;
}

export default function useBLE(): IUseBLE {
  const bleManager = useMemo(() => new BleManager(), []);
  const permissionManager = useMemo(() => new PermissionManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [thermistorData, setThermistorData] = useState<Sensors>();
  const [fsrData, setFsrData] = useState<Sensors>();
  const [spo2Data, setSpo2Data] = useState<SPO2Sensors>();

  async function scanForPeripherals(): Promise<void> {
    const permissionsGranted = await permissionManager.requestPermissions();
    if (!permissionsGranted) {
      console.log('Permissions not granted');
      return;
    }
    setIsScanning(true);

    bleManager.startDeviceScan(null, null, (error, device: Device | null) => {
      if (error) {
        console.log('ERROR: ', error);
      }

      // If device found with 'Disense' name, add to array if it doesn't already exist
      if (device?.name === 'Disense') {
        setAllDevices(prevDevices => {
          if (!deviceAlreadyExists(prevDevices, device)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });
  }

  function stopScanning(): void {
    setIsScanning(false);
    bleManager.stopDeviceScan();
  }

  async function connectToDevice(deviceId: DeviceId): Promise<void> {
    try {
      await bleManager.connectToDevice(deviceId);
      const connectedDevice =
        await bleManager.discoverAllServicesAndCharacteristicsForDevice(
          deviceId
        );

      stopScanning();

      setConnectedDevice(connectedDevice);

      // Remove device from available devices list
      setAllDevices(prevDevices =>
        prevDevices.filter(device => device.id !== connectedDevice.id)
      );
      getDataFromDevice(connectedDevice);
    } catch (e) {
      console.log('Error connecting to device: ', e);
    }
  }

  async function disconnectFromDevice(deviceId: DeviceId): Promise<void> {
    try {
      await bleManager.cancelDeviceConnection(deviceId);
      setConnectedDevice(null);
    } catch (e) {
      console.log('Error disconnecting from device: ', e);
    }
  }

  async function getDataFromDevice(device: Device): Promise<void> {
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

      // const byteArr = fromBase64ToByteArr(characteristic.value);
      // let sensorData;
      // if (sensorType === 'spo2') {
      //   sensorData = decodeByteArrForSPO2(byteArr);
      // } else {
      //   sensorData = decodeByteArray(byteArr, sensorType);
      // }
      // // console.log('sensorData: ', sensorData);
      // if (sensorType === 'thermistor') {
      //   setThermistorData(sensorData);
      // } else if (sensorType === 'fsr') {
      //   setFsrData(sensorData);
      // }
    }
  }

  function deviceAlreadyExists(devices: Device[], newDevice: Device): boolean {
    const result = devices.findIndex(device => device.id === newDevice.id);
    return result !== -1;
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

  return {
    scanForPeripherals,
    stopScanning,
    allDevices,
    isScanning,
    connectedDevice,
    connectToDevice,
    disconnectFromDevice,
    thermistorData,
    fsrData,
    spo2Data,
  };
}
