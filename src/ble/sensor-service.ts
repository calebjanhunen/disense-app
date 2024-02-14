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
import base64 from 'react-native-base64';

export class SensorService {
  // Constants
  readonly serviceUuid = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  readonly thermistorCharUuid = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
  readonly fsrCharUuid = 'f00a075c-948e-4f01-9cb6-7d876cf96683';
  readonly spo2CharUuid = '9f7d8c4f-b3d4-4d72-8787-8386e5f13195';
  readonly acknowledgmentCharUuid = '1b384bed-4282-41e1-8ef9-466bc94fa5ed';

  private readCharacteristicCallback: Subscription | null;
  private acknowledgmentCharacteristic: Characteristic | undefined;
  private onReadThermistor: (thermistorData: Thermistor[]) => void;
  private onReadFsr: (fsrData: FSR[]) => void;
  private onReadSPO2: (spo2Data: SPO2Sensor[]) => void;

  constructor(
    onReadThermistor: (thermistorData: Thermistor[]) => void,
    onReadFsr: (fsrData: FSR[]) => void,
    onReadSPO2: (spo2Data: SPO2Sensor[]) => void
  ) {
    this.readCharacteristicCallback = null;
    this.acknowledgmentCharacteristic = undefined;
    this.onReadThermistor = onReadThermistor;
    this.onReadFsr = onReadFsr;
    this.onReadSPO2 = onReadSPO2;
  }

  async readSensorData(device: Device) {
    // Set callbacks for when sensor data is read

    // Get services from device
    const services = await device.services();

    // Get sensor service
    const sensorService = services.find(
      service => service.uuid === this.serviceUuid
    );
    if (!sensorService) {
      console.log('Service does not exist');
      return;
    }

    // Get characteristics from sensor service
    const characteristics = await sensorService.characteristics();
    this.acknowledgmentCharacteristic = characteristics.find(
      characteristic => characteristic.uuid === this.acknowledgmentCharUuid
    );

    // Loop through characteristics and read data from sensor characteristics
    for (const characteristic of characteristics) {
      if (characteristic.isNotifiable) {
        this.readCharacteristicCallback =
          device.monitorCharacteristicForService(
            sensorService.uuid,
            characteristic.uuid,
            async (
              error: BleError | null,
              characteristic: Characteristic | null
            ) => {
              if (error) {
                console.log('error reading characteristic: ', error);
                return;
              }
              if (!characteristic || !characteristic.value) {
                console.log('Characteristic does not exist');
                return;
              }

              const byteArr = fromBase64ToByteArr(characteristic.value);

              if (characteristic.uuid === this.thermistorCharUuid) {
                const thermistorData = decodeByteArrayForThermistor(byteArr);
                console.log(thermistorData);
                this.onReadThermistor(thermistorData);
                await this.writeToAcknowledgeCharacteristic('thermistor');
              } else if (characteristic.uuid === this.fsrCharUuid) {
                const fsrData = decodeByteArrayForFSR(byteArr);
                console.log(fsrData);
                this.onReadFsr(fsrData);
                await this.writeToAcknowledgeCharacteristic('fsr');
              } else if (characteristic.uuid === this.spo2CharUuid) {
                const spo2Data = decodeByteArrForSPO2(byteArr);
                this.onReadSPO2(spo2Data);
              }
            }
          );
      }
    }
  }

  removeReadCharacteristicCallbackSubscription(): void {
    this.readCharacteristicCallback?.remove();
  }

  private async writeToAcknowledgeCharacteristic(value: string): Promise<void> {
    try {
      if (!this.acknowledgmentCharacteristic) {
        console.log('no acknowledgment characteristic');
        return;
      }
      await this.acknowledgmentCharacteristic.writeWithoutResponse(
        base64.encode(value)
      );
    } catch (e) {
      console.log('Error writing characteristic', e);
    }
  }
}
