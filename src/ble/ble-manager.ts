import { BleError, BleManager, Device } from 'react-native-ble-plx';
import { PermissionManager } from './permission-manager';

export class MyBleManager {
  private bleManager: BleManager;
  private permissionManager: PermissionManager;
  private connectedDevice1: Device | null;
  private connectedDevice2: Device | null;

  constructor() {
    this.bleManager = new BleManager();
    this.permissionManager = new PermissionManager();
    this.connectedDevice1 = null;
    this.connectedDevice2 = null;
  }

  /**
   * Scans and connected to disense devices
   */
  async connect(onDevicesConnected: (device1: Device) => void): Promise<void> {
    let foundDevice1: Device | null = null;
    // let foundDevice2: Device | null = null;

    const permissionsGranted =
      await this.permissionManager.requestPermissions();
    if (!permissionsGranted) {
      throw new Error('Permissions not granted');
    }
    this.bleManager.startDeviceScan(
      null,
      null,
      async (error: BleError | null, device: Device | null) => {
        if (error) {
          console.log(error);
          throw new Error('Error while scanning');
        }

        if (device?.name === 'Disense-1' && !foundDevice1) {
          foundDevice1 = device;
          this.connectedDevice1 = await this.connectToDevice(foundDevice1);
        }

        // TODO: Implement connecting to second sock

        if (this.connectedDevice1) {
          this.stopScanning();
          onDevicesConnected(this.connectedDevice1);
        }
      }
    );
  }

  /**
   * Connects to a ble device
   * @param deviceId - id of the device to connect to
   * @returns The connected device
   */
  private async connectToDevice(device: Device): Promise<Device> {
    if (this.connectedDevice1) throw new Error('Device 1 already connected');
    // TODO: Implement when 2nd sock is set up
    // if (this.connectedDevice2) throw new Error('Device 2 already connected');

    try {
      await this.bleManager.connectToDevice(device.id);
      const connectedDevice =
        await this.bleManager.discoverAllServicesAndCharacteristicsForDevice(
          device.id
        );
      return connectedDevice;
    } catch (e) {
      console.log('Error connecting to device: ', e);
      throw new Error('Could not connect to device');
    }
  }

  /**
   * Disconnects from a ble device
   * @param deviceId - Id of the device to disconnect from
   */
  async disconnectFromDevice(): Promise<void> {
    // TODO: Implement disconnecting from 2nd sock
    if (!this.connectedDevice1) {
      throw new Error('Device already disconnected');
    }
    try {
      await this.bleManager.cancelDeviceConnection(this.connectedDevice1.id);
      this.connectedDevice1 = null;
    } catch (e) {
      console.log(e);
      throw new Error('Could not disconnect from device');
    }
  }

  /**
   * Stops scanning for ble devices
   */
  stopScanning(): void {
    this.bleManager.stopDeviceScan();
  }

  getConnectedDevice1() {
    return this.connectedDevice1;
  }
}
