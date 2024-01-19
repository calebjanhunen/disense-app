import { PermissionsAndroid } from 'react-native';

export class PermissionManager {
  constructor() {}

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
