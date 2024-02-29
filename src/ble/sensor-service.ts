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
import { handleError } from '@/utils/error-handler';

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
    onReadThermistorAndFsrData: (
      thermistorData: Thermistor[],
      fsrData: FSR[]
    ) => void,
    onReadSpo2Data: (spo2Data: SPO2Sensor[]) => void
  ) {
    // Set callbacks for when sensor data is read

    // Get services from device
    const services = await device.services();

    // Get sensor service
    const sensorService = services.find(
      service => service.uuid === this.serviceUuid
    );
    if (!sensorService) {
      handleError(
        'Error reading Sensor data.',
        new Error(`Service with id: ${this.serviceUuid} does not exist`)
      );
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
              if (!characteristic || !characteristic.value) {
                return;
              }
              if (error) {
                handleError('Error reading sensor data', error);
                return;
              }

              // For now initialize sensor to 0 so the sensorData state variable gets updated even if spo2 data isn't read
              this.spo2Data = [{ id: 1, heartRate: 0, bloodOxygen: 0 }];

              const byteArr = fromBase64ToByteArr(characteristic.value);
              if (characteristic.uuid === this.thermistorCharUuid) {
                this.thermistorData = decodeByteArrayForThermistor(byteArr);
                await this.writeToAcknowledgeCharacteristic('thermistor');
              } else if (characteristic.uuid === this.fsrCharUuid) {
                this.fsrData = decodeByteArrayForFSR(byteArr);
                await this.writeToAcknowledgeCharacteristic('fsr');
              } else if (characteristic.uuid === this.spo2CharUuid) {
                this.spo2Data = decodeByteArrForSPO2(byteArr);
                await this.writeToAcknowledgeCharacteristic('spo2');
              }

              if (this.thermistorData && this.fsrData) {
                onReadThermistorAndFsrData(this.thermistorData, this.fsrData);
                this.thermistorData = null;
                this.fsrData = null;
              }

              if (this.spo2Data) {
                console.log('read spo2: ', this.spo2Data);
                onReadSpo2Data(this.spo2Data);
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
      if (callback) callback.remove();
    }
  }

  private async writeToAcknowledgeCharacteristic(value: string): Promise<void> {
    try {
      if (!this.acknowledgmentCharacteristic) {
        return;
      }
      await this.acknowledgmentCharacteristic.writeWithoutResponse(
        base64.encode(value)
      );
    } catch (e) {
      handleError('Error sending acknowledgment characteristic', e);
    }
  }
}
