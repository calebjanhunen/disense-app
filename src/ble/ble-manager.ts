import {
  BleError,
  BleManager,
  Device,
  Subscription,
} from 'react-native-ble-plx';
import { PermissionManager } from './permission-manager';

export class MyBleManager {
  private bleManager: BleManager;
  private permissionManager: PermissionManager;
  private connectedDevice1: Device | null;
  private connectedDevice2: Device | null;
  private onDeviceDisconnectSubscription: Subscription | null;

  constructor() {
    this.bleManager = new BleManager();
    this.bleManager.stopDeviceScan();
    this.permissionManager = new PermissionManager();
    this.connectedDevice1 = null;
    this.connectedDevice2 = null;
    this.onDeviceDisconnectSubscription = null;
  }

  /**
   * Scans and connected to disense devices
   */
  async connect(onDevicesConnected: (device1: Device) => void): Promise<void> {
    this.connectedDevice1 = null;
    const permissionsGranted =
      await this.permissionManager.requestPermissions();
    if (!permissionsGranted) {
      console.log('Permissions error');
    }
    this.bleManager.startDeviceScan(
      null,
      null,
      async (error: BleError | null, device: Device | null) => {
        if (error) {
          console.log('Error while scanning: ', error);
          this.stopScanning();
        }
        if (device?.name === 'Disense-1' && !this.connectedDevice1) {
          console.log('Found disense-1');
          this.stopScanning();
          try {
            await this.connectToDevice(device);
          } catch (e) {
            console.log('Error connecting: ', e);
          }
        }

        // TODO: Implement connecting to second sock

        if (this.connectedDevice1) {
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
  private async connectToDevice(device: Device): Promise<void> {
    if (!this.bleManager) {
      return;
    }
    if (this.connectedDevice1) {
      console.log('Device 1 already connected');
    }
    // TODO: Implement when 2nd sock is set up
    // if (this.connectedDevice2) throw new Error('Device 2 already connected');

    try {
      await this.bleManager.connectToDevice(device.id);
      this.connectedDevice1 =
        await this.bleManager.discoverAllServicesAndCharacteristicsForDevice(
          device.id
        );
      console.log('device connected');
      this.setupDisconnectionListener(this.connectedDevice1);
    } catch (e) {
      console.log('Error connecting to device: ', e);
    }
  }

  /**
   * Disconnects from a ble device
   * @param deviceId - Id of the device to disconnect from
   */
  async disconnectFromDevice(): Promise<void> {
    // TODO: Implement disconnecting from 2nd sock
    this.onDeviceDisconnectSubscription?.remove();
    if (!this.connectedDevice1) {
      console.log('device already disconnected');
      return;
    }
    try {
      await this.bleManager.cancelDeviceConnection(this.connectedDevice1.id);
      this.connectedDevice1 = null;
      console.log('disconnected');
    } catch (e) {
      console.log(e);
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

  private setupDisconnectionListener(device: Device): void {
    this.onDeviceDisconnectSubscription = this.bleManager.onDeviceDisconnected(
      device.id,
      (error: BleError | null, device: Device | null) => {
        if (error) {
          console.log('Error on device disconnect: ', error);
        }
        this.connectedDevice1 = null;
        // this.disconnectFromDevice();
        console.log('Device disconnected: ', device?.id);
        if (device) this.attemptReconnect(device);
      }
    );
  }

  private attemptReconnect(device: Device): void {
    const numAttempts = 5;
    let currAttempt = 0;

    const retryConnect = async () => {
      try {
        await this.bleManager.connectToDevice(device.id);
        this.connectedDevice1 =
          await this.bleManager.discoverAllServicesAndCharacteristicsForDevice(
            device.id
          );
        console.log('device reconnected');
      } catch (e) {
        console.log('Error reconnecting to device: ', e);
        currAttempt++;
        if (currAttempt < numAttempts) {
          setTimeout(retryConnect, 200);
        }
      }
    };

    setTimeout(() => {
      retryConnect();
    }, 10000);
  }
}
