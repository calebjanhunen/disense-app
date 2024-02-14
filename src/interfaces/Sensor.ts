import { SensorType } from '../types/sensor-types';

export interface Sensor {
  id: number;
  value: number;
}

export interface Sensors {
  type: SensorType;
  sensors: Sensor[];
}

export interface SPO2Sensors {
  sensors: SPO2Sensor[];
}

export interface SPO2Sensor {
  id: number;
  heartRate: number;
  bloodOxygen: number;
}

export interface Thermistor {
  id: number;
  temp: number;
}

export interface FSR {
  id: number;
  force: number;
}
