import React, { createContext, useContext, useMemo, useState } from 'react';
import { MyBleManager } from '../ble/ble-manager';
import { Device } from 'react-native-ble-plx';

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
  const bleManager = useMemo(() => new MyBleManager(), []);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // TODO: Implement for 2nd sock when set up
  function onDeviceConnected(device1: Device): void {
    setConnectedDevice(device1);
    setIsConnecting(false);
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
    await bleManager.connect(onDeviceConnected);
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
