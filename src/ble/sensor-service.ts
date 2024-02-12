import {
  BleError,
  Characteristic,
  Device,
  Subscription,
} from 'react-native-ble-plx';
import { FSR, SPO2Sensor, Thermistor } from '../interfaces/Sensor';
import {
  decodeByteArrForSPO2,
  decodeByteArrayForFSR,
  decodeByteArrayForThermistor,
  fromBase64ToByteArr,
} from './byte-array-manager';

export class SensorService {
  // Constants
  readonly SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  readonly THERMISTORS_CHARACTERISTIC_UUID =
    'beb5483e-36e1-4688-b7f5-ea07361b26a8';
  readonly FSR_CHARACTERISTIC_UUID = 'f00a075c-948e-4f01-9cb6-7d876cf96683';
  readonly SPO2_CHARACTERISTIC_UUID = '9f7d8c4f-b3d4-4d72-8787-8386e5f13195';

  private readCharacteristicCallback: Subscription | null;

  constructor() {
    this.readCharacteristicCallback = null;
  }

  async readSensorData(
    device: Device,
    onReadThermistor: (thermistorData: Thermistor[]) => void,
    onReadFSR: (fsrData: FSR[]) => void,
    onReadSPO2: (spo2Data: SPO2Sensor[]) => void
  ) {
    const services = await device.services();
    const sensorService = services.find(
      service => service.uuid === this.SERVICE_UUID
    );
    if (!sensorService) {
      console.log('Service does not exist');
      return;
    }

    const characteristics = await sensorService.characteristics();

    for (const characteristic of characteristics) {
      this.readCharacteristicCallback = device.monitorCharacteristicForService(
        sensorService.uuid,
        characteristic.uuid,
        (error: BleError | null, characteristic: Characteristic | null) => {
          if (error) {
            console.log('error reading characteristic: ', error);
            return;
          }
          if (!characteristic || !characteristic.value) {
            console.log('Characteristic does not exist');
            return;
          }

          const byteArr = fromBase64ToByteArr(characteristic.value);
          if (characteristic.uuid === this.THERMISTORS_CHARACTERISTIC_UUID) {
            const thermistorData = decodeByteArrayForThermistor(byteArr);
            console.log(thermistorData);
            onReadThermistor(thermistorData);
          } else if (characteristic.uuid === this.FSR_CHARACTERISTIC_UUID) {
            const fsrData = decodeByteArrayForFSR(byteArr);
            onReadFSR(fsrData);
          } else if (characteristic.uuid === this.SPO2_CHARACTERISTIC_UUID) {
            const spo2Data = decodeByteArrForSPO2(byteArr);
            onReadSPO2(spo2Data);
          }
        }
      );
    }
  }

  removeReadCharacteristicCallbackSubscription(): void {
    this.readCharacteristicCallback?.remove();
  }
}
