import { useMemo, useState } from 'react';
import base64 from 'react-native-base64';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  DeviceId,
} from 'react-native-ble-plx';
import { PermissionManager } from '../utils/permission-manager';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const THERMISTOR_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const TEST_CHARACTERISTIC_UUID = '1dba189b-3ce8-4f00-bfa3-789beec575f8';

interface IUseBLE {
  scanForPeripherals(): void;
  connectToDevice(deviceId: DeviceId): Promise<void>;
  disconnectFromDevice(deviceId: DeviceId): Promise<void>;
  stopScanning(): void;
  allDevices: Device[];
  connectedDevices: Device[];
  isScanning: boolean;
  temp: string | undefined;
}

export default function useBLE(): IUseBLE {
  const bleManager = useMemo(() => new BleManager(), []);
  const permissionManager = useMemo(() => new PermissionManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [temp, setTemp] = useState<string>();

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

      // Add device to connected devices if it doesn't already exist in the array
      setConnectedDevices(prevDevices => {
        if (!deviceAlreadyExists(prevDevices, connectedDevice)) {
          return [...prevDevices, connectedDevice];
        }
        return prevDevices;
      });

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
      setConnectedDevices(prevDevices =>
        prevDevices.filter(device => device.id !== deviceId)
      );
    } catch (e) {
      console.log('Error disconnecting from device: ', e);
    }
  }

  async function getDataFromDevice(device: Device): Promise<void> {
    // if (device) {
    //   device.monitorCharacteristicForService(
    //     SERVICE_UUID,
    //     THERMISTOR_CHARACTERISTIC_UUID,
    //     onReadFromDevice
    //   );
    // }

    const services = await device.services();
    const service = services.find(s => s.uuid === SERVICE_UUID);
    if (!service) {
      console.log('Service not found');
      return;
    }
    const characteristics = await service.characteristics();
    console.log(characteristics);
    for (const characteristic of characteristics) {
      //   // console.log(characteristic);
      // console.log(characteristic.uuid, characteristic.value);
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        characteristic.uuid,
        onReadFromDevice
      );
    }
  }

  function onReadFromDevice(
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
      // console.log(characteristic.value);
      console.log(
        'ID: ' +
          characteristic.uuid +
          'val: ' +
          base64.decode(characteristic.value)
      );
      setTemp(base64.decode(characteristic.value));
    }
  }

  function deviceAlreadyExists(devices: Device[], newDevice: Device): boolean {
    const result = devices.findIndex(device => device.id === newDevice.id);
    return result !== -1;
  }

  return {
    scanForPeripherals,
    stopScanning,
    allDevices,
    isScanning,
    connectedDevices,
    connectToDevice,
    disconnectFromDevice,
    temp,
  };
}
