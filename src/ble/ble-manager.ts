import {
  BleError,
  BleManager,
  Device,
  Subscription,
} from 'react-native-ble-plx';
import { PermissionManager } from './permission-manager';
import { SensorService } from './sensor-service';
import { handleError } from '@/utils/error-handler';

export class MyBleManager {
  // private connectedDevice2: Device | null;
  private bleManager: BleManager;
  private sensorService: SensorService;
  private permissionManager: PermissionManager;
  private connectedDevice1: Device | null;
  private onDeviceDisconnectSubscription: Subscription | null;
  private onDeviceConnectCallback: ((device1: Device) => void) | null;
  private shouldReconnect: boolean;
  private onDeviceDisconnectedCallback: (() => void) | null;

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
    this.onDeviceDisconnectedCallback = null;
  }

  /**
   * Scans and connected to disense devices
   */
  async connect(
    onDevicesConnected: (device1: Device) => void,
    onDeviceDisconnected: () => void
  ): Promise<void> {
    this.onDeviceConnectCallback = onDevicesConnected;
    this.onDeviceDisconnectedCallback = onDeviceDisconnected;
    this.connectedDevice1 = null;
    this.shouldReconnect = true;
    const permissionsGranted =
      await this.permissionManager.requestPermissions();
    if (!permissionsGranted) {
      handleError(
        'Permissions not granted',
        new Error('Permissions for bluetooth not granted')
      );
    }
    this.bleManager.startDeviceScan(
      null,
      null,
      async (error: BleError | null, device: Device | null) => {
        if (error) {
          this.stopScanning();
          handleError('Error while scanning', error);
        }
        if (device?.name === 'Disense-1' && !this.connectedDevice1) {
          this.stopScanning();
          try {
            await this.connectToDevice(device);
          } catch (e) {
            handleError(`Error connecting to ${device.id}`, e);
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
    if (this.onDeviceDisconnectedCallback) this.onDeviceDisconnectedCallback();
    if (!this.connectedDevice1) {
      return;
    }
    try {
      await this.bleManager.cancelDeviceConnection(this.connectedDevice1.id);
      this.connectedDevice1 = null;
    } catch (e) {
      handleError('Error disconnecting from device', e);
    }
  }

  /**
   * Stops scanning for ble devices
   */
  stopScanning(): void {
    this.bleManager.stopDeviceScan();
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

    await this.bleManager.connectToDevice(device.id);
    this.connectedDevice1 =
      await this.bleManager.discoverAllServicesAndCharacteristicsForDevice(
        device.id
      );
    // this.setupDisconnectionListener(this.connectedDevice1);
  }

  private setupDisconnectionListener(device: Device): void {
    this.onDeviceDisconnectSubscription = this.bleManager.onDeviceDisconnected(
      device.id,
      (error: BleError | null, device: Device | null) => {
        if (error) {
          handleError('Error on device disconnect', error);
        }
        this.sensorService.removeReadCharacteristicCallbackSubscriptions();
        this.connectedDevice1 = null;
        // this.disconnectFromDevice();
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
      if (!this.shouldReconnect) return;

      if (await this.bleManager.isDeviceConnected(device.id)) {
        return;
      }

      try {
        await this.bleManager.connectToDevice(device.id);
        this.connectedDevice1 =
          await this.bleManager.discoverAllServicesAndCharacteristicsForDevice(
            device.id
          );
        if (this.onDeviceConnectCallback)
          this.onDeviceConnectCallback(this.connectedDevice1);
        currAttempt = 0;
      } catch (e) {
        currAttempt++;
        if (currAttempt < numAttempts) {
          setTimeout(retryConnect, 1000);
        } else {
          this.disconnectFromDevice();
          handleError(
            'Disense socks disconnected',
            new Error(
              'Failed to reconnect after 5 retries. Please reconnect manually'
            )
          );
        }
      }
    };

    setTimeout(() => {
      retryConnect();
    }, 10000);
  }
}
