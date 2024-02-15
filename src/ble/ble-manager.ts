import {
  BleError,
  BleManager,
  Device,
  Subscription,
} from 'react-native-ble-plx';
import { PermissionManager } from './permission-manager';
import { SensorService } from './sensor-service';

export class MyBleManager {
  // private connectedDevice2: Device | null;
  private bleManager: BleManager;
  private sensorService: SensorService;
  private permissionManager: PermissionManager;
  private connectedDevice1: Device | null;
  private onDeviceDisconnectSubscription: Subscription | null;
  private onDeviceConnectCallback: ((device1: Device) => void) | null;
  private shouldReconnect: boolean;

  constructor(sensorService: SensorService) {
    // TODO maybe sometime later:
    // Save connectedDevice to async storage so on app reload it gets it from storage if it exists and wont need to reconnect
    this.bleManager = new BleManager();
    this.sensorService = sensorService;
    this.permissionManager = new PermissionManager();
    this.connectedDevice1 = null;
    this.onDeviceDisconnectSubscription = null;
    this.onDeviceConnectCallback = null;
    this.shouldReconnect = false;
  }

  /**
   * Scans and connected to disense devices
   */
  async connect(onDevicesConnected: (device1: Device) => void): Promise<void> {
    this.onDeviceConnectCallback = onDevicesConnected;
    this.connectedDevice1 = null;
    this.shouldReconnect = true;
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
   * Disconnects from a ble device
   * @param deviceId - Id of the device to disconnect from
   */
  async disconnectFromDevice(): Promise<void> {
    // TODO: Implement disconnecting from 2nd sock
    this.sensorService.removeReadCharacteristicCallbackSubscriptions();
    this.onDeviceDisconnectSubscription?.remove();
    this.shouldReconnect = false;
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

  getSensorService(): SensorService {
    return this.sensorService;
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

  private setupDisconnectionListener(device: Device): void {
    this.onDeviceDisconnectSubscription = this.bleManager.onDeviceDisconnected(
      device.id,
      (error: BleError | null, device: Device | null) => {
        if (error) {
          console.log('Error on device disconnect: ', error);
        }
        this.sensorService.removeReadCharacteristicCallbackSubscriptions();
        this.connectedDevice1 = null;
        // this.disconnectFromDevice();
        console.log('Device disconnected: ', device?.id);
        if (device) {
          this.attemptReconnect(device);
        }
      }
    );
  }

  private attemptReconnect(device: Device): void {
    const numAttempts = 5;
    let currAttempt = 0;

    const retryConnect = async () => {
      console.log('Attempting reconnection');
      console.log('should reconnect? ', this.shouldReconnect);
      if (!this.shouldReconnect) return;

      if (await this.bleManager.isDeviceConnected(device.id)) {
        console.log('device already connected');
        return;
      }

      try {
        await this.bleManager.connectToDevice(device.id);
        this.connectedDevice1 =
          await this.bleManager.discoverAllServicesAndCharacteristicsForDevice(
            device.id
          );
        console.log('device reconnected');
        if (this.onDeviceConnectCallback)
          this.onDeviceConnectCallback(this.connectedDevice1);
        currAttempt = 0;
      } catch (e) {
        console.log('Error reconnecting to device: ', e);
        currAttempt++;
        console.log(currAttempt);
        if (currAttempt < numAttempts) {
          setTimeout(retryConnect, 1000);
        } else {
          this.disconnectFromDevice();
        }
      }
    };

    setTimeout(() => {
      retryConnect();
    }, 10000);
  }
}
