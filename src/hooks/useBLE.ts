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
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

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

    bleManager.startDeviceScan(null, null, (error, device: Device | null) => {
      setIsScanning(true);

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
      const connectedDevice = await bleManager.connectToDevice(deviceId);
      await bleManager.discoverAllServicesAndCharacteristicsForDevice(deviceId);
      stopScanning();
      setConnectedDevices(prevDevices => {
        if (!deviceAlreadyExists(prevDevices, connectedDevice)) {
          return [...prevDevices, connectedDevice];
        }
        return prevDevices;
      });

      setAllDevices(prevDevices =>
        prevDevices.filter(device => device.id !== connectedDevice.id)
      );
      readFromDevice(connectedDevice);
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

  function readFromDevice(device: Device): void {
    if (device) {
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
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
      console.log(base64.decode(characteristic.value));
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
