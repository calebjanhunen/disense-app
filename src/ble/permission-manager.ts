import * as ExpoDevice from 'expo-device';
import { PermissionsAndroid, Platform } from 'react-native';

export class PermissionManager {
  constructor() {}

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const fineLocationPermission =
          await this.requestFineLocationPermission();
        return fineLocationPermission;
      } else {
        const isAndroid31PermissionsGranted =
          await this.requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  }

  async requestAndroid31Permissions(): Promise<boolean> {
    const scanPermission = await this.requestBLEScanPermission();
    const connectPermission = await this.requestBLEConnectPermission();
    const fineLocationPermission = await this.requestFineLocationPermission();

    return scanPermission && connectPermission && fineLocationPermission;
  }

  async requestBLEScanPermission(): Promise<boolean> {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );

    return permission === PermissionsAndroid.RESULTS.GRANTED;
  }

  async requestBLEConnectPermission(): Promise<boolean> {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );

    return permission === PermissionsAndroid.RESULTS.GRANTED;
  }

  async requestFineLocationPermission(): Promise<boolean> {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );

    return permission === PermissionsAndroid.RESULTS.GRANTED;
  }
}
