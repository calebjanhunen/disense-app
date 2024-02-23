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

  private readCharacteristicCallbacks: Subscription[];
  private acknowledgmentCharacteristic: Characteristic | undefined;
  private thermistorData: Thermistor[] | null;
  private fsrData: FSR[] | null;
  private spo2Data: SPO2Sensor[] | null;

  constructor() {
    this.readCharacteristicCallbacks = new Array(3);
    this.acknowledgmentCharacteristic = undefined;
    this.thermistorData = null;
    this.fsrData = null;
    this.spo2Data = null;
  }

  async readSensorData(
    device: Device,
    onReadSensors: (
      thermistorData: Thermistor[],
      fsrData: FSR[],
      spo2Data: SPO2Sensor[]
    ) => void
  ) {
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
    let i = 0;
    for (const characteristic of characteristics) {
      if (characteristic.isNotifiable) {
        this.readCharacteristicCallbacks[i] =
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
                console.log('read thermistor');
                this.thermistorData = decodeByteArrayForThermistor(byteArr);
                await this.writeToAcknowledgeCharacteristic('thermistor');
              } else if (characteristic.uuid === this.fsrCharUuid) {
                console.log('read fsr');
                this.fsrData = decodeByteArrayForFSR(byteArr);
                await this.writeToAcknowledgeCharacteristic('fsr');
              } else if (characteristic.uuid === this.spo2CharUuid) {
                console.log('read spo2');
                this.spo2Data = decodeByteArrForSPO2(byteArr);
                await this.writeToAcknowledgeCharacteristic('spo2');
              }

              if (this.thermistorData && this.fsrData && this.spo2Data) {
                onReadSensors(this.thermistorData, this.fsrData, this.spo2Data);
                this.thermistorData = null;
                this.fsrData = null;
                this.spo2Data = null;
              }
            }
          );
        i++;
      }
    }
  }

  removeReadCharacteristicCallbackSubscriptions(): void {
    for (const callback of this.readCharacteristicCallbacks) {
      callback.remove();
    }
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
