import React, { createContext, useContext, useMemo, useState } from 'react';
import { Device } from 'react-native-ble-plx';

import { MyBleManager } from '@/ble/ble-manager';
import { SensorService } from '@/ble/sensor-service';
import { FSR, SPO2Sensor, Thermistor } from '@/interfaces/Sensor';
import { useSensorData } from './sensor-context/sensor-context';

interface IBLEContext {
  connectToDevice(): Promise<void>;
  disconnectFromDevice(): Promise<void>;
  stopConnecting(): void;
  connectedDevice: Device | null;
  isConnecting: boolean;
}

interface Props {
  children: React.ReactNode;
}
const BleContext = createContext<IBLEContext>({} as IBLEContext);

export const useBLE = () => useContext(BleContext);

export function BLEContextProvider({ children }: Props) {
  const sensorService = useMemo(() => new SensorService(), []);
  const bleManager = useMemo(() => new MyBleManager(sensorService), []);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const { updateThermistorAndFsrData, updateSpo2Data } = useSensorData();
  // console.log('ble context rerenderd');

  // TODO: Implement for 2nd sock when set up
  function onDeviceConnected(device1: Device): void {
    setConnectedDevice(device1);
    setIsConnecting(false);
    sensorService.readSensorData(
      device1,
      onReadAnalogSensors,
      onReadSpo2Sensor
    );
  }

  function onDeviceDisconnected(): void {
    setConnectedDevice(null);
  }

  function onReadAnalogSensors(
    thermistorData: Thermistor[],
    fsrData: FSR[]
  ): void {
    updateThermistorAndFsrData(thermistorData, fsrData);
  }

  function onReadSpo2Sensor(spo2Data: SPO2Sensor[]): void {
    updateSpo2Data(spo2Data);
  }

  async function connectToDevice(): Promise<void> {
    // setTimeout(() => {
    //   if (!bleManager.getConnectedDevice1()) {
    //     bleManager.stopScanning();
    //     setIsConnecting(false);
    //     Alert.alert('Device not found', 'Disense socks could not be found', [
    //       { text: 'ok' },
    //     ]);
    //   }
    // }, 10000);

    setIsConnecting(true);
    await bleManager.connect(onDeviceConnected, onDeviceDisconnected);
  }

  async function disconnectFromDevice(): Promise<void> {
    // TODO: Implement disconnecting from 2nd sock when set up
    setConnectedDevice(null);
    await bleManager.disconnectFromDevice();
  }

  function stopConnecting(): void {
    setIsConnecting(false);
    bleManager.stopScanning();
  }

  return (
    <BleContext.Provider
      value={{
        stopConnecting,
        connectedDevice,
        connectToDevice,
        disconnectFromDevice,
        isConnecting,
      }}
    >
      {children}
    </BleContext.Provider>
  );
}
